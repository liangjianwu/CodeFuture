const { returnResult, returnError, returnSuccess } = require("../../components/errcode")
const model = require("../../db/model");
const { ErrorHint, Debug } = require("../../components");
const { checkAuth } = require("../auth");
const { generateCode } = require("../../components/util");
const { doWithTry } = require("../../controllers/utils/Common");
var pathlib = require("path");
const md5 = require("md5");
const db = require("../../db/db");
const Event = model.Event
const UserEvent = model.UserEvent
module.exports.loadEvents = async (req, res) => {
    doWithTry(res, async () => {
        let where = { mid: req.mid, status: 2 }
        if(req.uid>0) {
            where.publish_status = {[db.Sequelize.Op.gt]:0}
        }else {
            where.publish_status = 1
        }
        let et = await Event.findAll({ attributes: ['id', 'name','photo','code', 'description', 'begin', 'end', 'sign', 'apply', 'pay','fee', 'update_time'], where: where, order: [['update_time', "desc"]], limit: 50 })
        return returnResult(res, et)
    })
}
module.exports.getEvent = async (req, res) => {
    try {
        let { code, applyid, token, time } = req.query
        let where = { code: code, status: 2 }
        let et = await Event.findOne({ attributes: ['id', 'mid', 'photo', 'name', 'description', 'begin', 'end', 'sign', 'html', 'form', 'apply', 'pay', 'fee'], where: where })
        if (!et) {
            return returnError(res, 600001)
        } else {
            if (et.form && et.form.length > 0) {
                et.form = JSON.parse(et.form)
            }
            let check = await checkAuth(req)
            let apply = null
            let met = null
            if (et.sign == 1 && req.uid >= 0 && check == 0) {
                met = await UserEvent.findOne({ where: { event_id: et.id, user_id: req.uid, status: 1 } })
            } else if (applyid > 0) {
                met = await UserEvent.findOne({ where: { id: applyid, event_id: et.id, status: 1 } })
                if (met && (token != md5(met.code + et.id + met.id + time))) {
                    Debug([token,met.code,et.id,met.id,time,md5(met.code + et.id + met.id + time)])
                    Debug("token error")
                    met = null
                }
            }
            if (met != null) {
                if (met.form && met.form.length > 0) {
                    let form = JSON.parse(met.form)
                    form.map((f, index) => {
                        f.items && f.items.map((item, index1) => {
                            if (et.form[index] && et.form[index].items
                                && et.form[index].items[index1]
                                && et.form[index].items[index1].type == item.type
                                && et.form[index].items[index1].name == item.name) {
                                et.form[index].items[index1].value = item.value
                            }
                        })
                    })
                }
                apply = { id: met.id, code: met.code, pay_status: met.pay_status, pay_amount: met.pay_amount, pay_time: met.pay_time }

            }
            return returnResult(res, { event: et, apply: apply })
        }
    } catch (e) {
        ErrorHint(e)
        return returnError(res, 900001)
    }
}


module.exports.applyEvent = async (req, res) => {
    let { event_id, form, id, code } = req.body
    try {
        let et = await Event.findOne({ where: { id: event_id, status: 2 } })
        if (!et) {
            return returnError(res, 610001)
        }
        if(et.end > 0 && new Date(et.end).getTime() < Date.now()) {
            return returnError(res,610003)
        }
        if(et.begin > 0 && new Date(et.begin).getTime() > Date.now()) {
            return returnError(res,610004)
        }
        if (id > 0) {
            let met = await UserEvent.findOne({ where: { id: id, code: code, status: 1 } })
            if (!met) {
                return returnError(res, 610002)
            }
            met.form = form
            await met.save()
            return returnResult(res,  { id: met.id, code: met.code,pay_status:met.pay_status,pay_amount:met.pay_amount,pay_time:met.pay_time })
        } else {
            let data = {
                event_id: event_id,
                form: form,
                code: generateCode(6),
                status: 1,
                pay_status:0,                
            }
            if (req.uid > 0) {
                data.user_id = req.uid
            }
            let met = await UserEvent.create(data)
            return returnResult(res,  { id: met.id, code: met.code,pay_status:met.pay_status,pay_amount:met.pay_amount,pay_time:met.pay_time })
        }
    } catch (e) {
        ErrorHint(e)
        return returnError(res, 610002)
    }
}
module.exports.setupPay = async(req,res)=>{
    doWithTry(res,async()=>{
        let {id,code} = req.body
        let met = await UserEvent.findOne({ where: { id: id, code: code, status: 1 } })
        if (!met) {
            return returnError(res, 610002)
        }
        if(met && met.pay_status == 1) {
            return returnError(res,610005)
        }
        let event = await Event.findOne({where:{id:met.event_id,status:2}})
        if(!event) {
            return returnError(res,600001)
        }        
        const stripe = require('stripe')('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');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.floor(event.fee*100),
            currency: 'cad',
            automatic_payment_methods: {enabled: true},
          });
        let time = Date.now()
        met.pay_order = paymentIntent.client_secret
        met.pay_amount = event.fee
        await met.save()
        return returnResult(res,{secret:paymentIntent.client_secret,amount:event.fee,time:time,token:md5(met.code+event.id+met.id+time)})
    })
    
}
module.exports.payCallback = async(req,res) =>{
    let {applyid,token,time,payment_intent,payment_intent_client_secret,redirect_status} = req.query
    doWithTry(res,async()=>{        
        let met = await UserEvent.findOne({ where: { id:applyid } })
        if (!met) {
            res.redirect('/event/'+event.code+'?paycallback=failed&code=610002')            
        }
        let event = await Event.findOne({where:{id:met.event_id,status:2}})
        if(!event) {
            res.redirect('/event/'+event.code+'?paycallback=failed&code=610001')            
        } 
        if(md5(met.code+met.event_id+met.id+time) != token) {
            res.redirect('/event/'+event.code+'?paycallback=failed&code=600009')            
        }
        if(redirect_status && redirect_status === 'succeeded') {
            met.pay_status = 1        
            met.pay_order = payment_intent
            met.pay_time = new Date().toLocaleString('en-US',{timeZone:'America/Toronto',hour12: false})
            await met.save()
            res.redirect('/event/'+event.code+'?paycallback=success&applyid='+applyid+'&token='+token+'&time='+time)
        }else {
            res.redirect('/event/'+event.code+'?paycallback=failed&code=600000')
        }
    })
}
module.exports.payEvent = async (req,res) => {
    let {event_id,id,code,order,amount} = req.body
    doWithTry(res,async()=>{
        let et = await Event.findOne({ where: { id: event_id, status: 2 } })
        if (!et) {
            return returnError(res, 610001)
        }
        
        let met = await UserEvent.findOne({ where: { id: id, code: code, status: 1 } })
        if (!met) {
            return returnError(res, 610002)
        }
        met.pay_status = 1
        met.pay_amount = amount
        met.pay_order = order
        met.pay_time = Date.now()
        await met.save()
        return returnResult(res,  { id: met.id, code: met.code,pay_status:met.pay_status,pay_amount:met.pay_amount,pay_order:met.pay_order,pay_time:met.pay_time })
        
    })
}

module.exports.photo = async(req,res)=>{
    
    let {file} = req.query
    let a = file.split('.')
    if(a.length != 2 || isNaN(a[0]) || (a[1] != 'jpg' && a[1] != 'jpeg' && a[1] != 'png')) {
        return returnError(res,900001)
    }
    // res.setHeader("Content-Type", "image/jpeg,image/png")
    res.sendFile(pathlib.resolve('./test/upload/'+file))

}

module.exports.loadApplicantsList = async (req, res) => {
    doWithTry(res,async ()=>{
        
            const {code} = req.query
            let where = {mid:req.mid,code:code}
            
            let evt = await Event.findOne({where:where})
            if(!evt) {
                return returnError(res,600001)
            }
            where = { event_id:evt.id }
            let applicants = await UserEvent.findAll({
                where: where,
                attributes: ['id','form'],                
            })
            let list = []
            applicants.map(applicant=>{
                let form = applicant.form?JSON.parse(applicant.form):[]
                let item = {id:applicant.id}
                for(let i =0;i<form.length;i++) {
                    let items = form[i].items                    
                    for(let j=0;j<items.length;j++) {
                        if(items[j].type == 'input' && items[j].name == 'name') {
                            item.name = items[j].value                            
                            break
                        }
                    }
                    if(item.name) {
                        break
                    }
                }
                list.push(item)
            }) 
            return returnResult(res,list)
       
    })
}