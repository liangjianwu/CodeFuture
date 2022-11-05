const { returnResult, returnError, returnSuccess } = require("../components/errcode")
const model = require("../db/model");
const { AppsList } = require("../configs/AppList");
const { loadMenu } = require("../components/MenuUtil");
const { ErrorHint, Debug } = require("../components");
const { checkMerchantUser, doWithTry } = require("./utils/Common");
const { generateHtml } = require('../components/emailtemplatecompile');
const db = require("../db/db");
const { generateCode } = require("../components/util");
const { photo } = require("./ResourceCtrl");
const Event = model.Event
const UserProfile = model.UserProfile
const Member = model.Member
const UserEvent = model.UserEvent
module.exports.loginLoad = async (req, res) => {
    let content = { serviceMenu: [] }
    let menus = await loadMenu(req.uid, AppsList.event.appid)
    if (menus) {
        content.serviceMenu = menus
        return returnResult(res, content)
    } else {
        return returnError(res, 910001)
    }
}

module.exports.loadEvents = async (req, res) => {
    doWithTry(res,async()=>{
        const { page, pagesize, countdata } = req.query
        let where = { status: {[db.Sequelize.Op.gt]:0}, mid:req.mid }
        
        let retdata = { total: 0, data: [] }

        countdata == 1 && (retdata.total = await Event.count({ where: where }))

        retdata.data = await Event.findAll({
            where: where,
            attributes: ['id', 'name', 'description', 'photo','code', 'begin', 'end', 'sign','apply','pay','fee','form','status','publish_status', 'create_time'],
            limit: pagesize * 1,
            offset: page * pagesize,
            order: [["id", "desc"]],
        })
        return returnResult(res, retdata)
    })
}

module.exports.loadApplicants = async (req, res) => {
    doWithTry(res,async ()=>{
        
            const {id, page, pagesize, countdata } = req.query
            let where = {mid:req.mid,id:id}
            
            let evt = await Event.findOne({where:where,attributes:["id","name","pay","sign","fee","code","sign"]})
            if(!evt) {
                return returnError(res,600001)
            }
            where = { event_id:id }
            let retdata = { total: 0, data: [],event:evt }
            countdata == 1 && (retdata.total = await UserEvent.count({ where: where }))
            UserEvent.hasOne(UserProfile,{sourceKey:'user_id',foreignKey:'user_id'})
            UserEvent.hasOne(Member,{sourceKey:'member_id',foreignKey:'id'})

            retdata.data = await UserEvent.findAll({
                where: where,
                attributes: ['id','form','user_id','member_id','pay_status','pay_amount','pay_time'],
                include:[
                    {model:UserProfile,attributes:['name','email','phone'],required:false},
                    {model:Member,attributes:['name'],required:false}
                ],
                limit: pagesize * 1,
                offset: page * pagesize,
                order: [["id", "desc"]],
            })
            return returnResult(res, retdata)
       
    })
}

module.exports.getEvent = async (req, res) => {
    doWithTry(res,async ()=>{
        try {

            let where = { id: req.query.id, status: {[db.Sequelize.Op.gt]:0}, mid:req.mid }
            
            let et = await Event.findOne({ attributes:['id','mid','name','photo','description','code','begin','end','sign','apply','pay','fee','template','html','form','status','publish_status'],where: where })
            if (!et) {
                return returnError(res, 600001)
            } else {                
                return returnResult(res, et)
            }
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 900001)
        }
    })
}
module.exports.editEvent = async (req, res) => {
    doWithTry(res,async ()=>{
        try {
            const { name, form,description,sign,fee, template, begin, end, id,apply,pay,photo } = req.body
            if (id > 0) {
                let where = { id: id, status: {[db.Sequelize.Op.gt]:0}, mid:req.mid }
                
                let et = await Event.findOne({ where: where })
                if (!et) return returnError(res, 600001)
                et.template = template
                et.html = template ? generateHtml(JSON.parse(template)):''
                et.form = form
                et.begin = begin
                et.end = end
                et.sign = sign
                et.apply = apply
                et.pay = pay
                et.fee = fee
                et.name = name
                et.photo = photo
                et.description = description
                et.save()
                return returnResult(res, {id:et.id,code:et.code})
            } else {
                let et = await Event.create({                    
                    mid:req.mid,
                    template: template,
                    html: template ? generateHtml(JSON.parse(template)):'',
                    code: generateCode(6),
                    form:form,
                    begin: begin,
                    end: end,
                    sign:sign,
                    pay:pay,
                    fee:fee,
                    apply:apply,
                    photo:photo,
                    name: name,
                    description: description,
                })
                return returnResult(res, {id:et.id,code:et.code})
            }
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 900001)
        }
    })
}
module.exports.removeEvent = async (req, res) => {
    doWithTry(res,async ()=>{
        try {

            let where = { id: req.body.id, mid:req.mid }
            
            let et = await Event.findOne({ where: where })
            if (!et) {
                return returnError(res, 600001)
            } else {
                et.status = 0
                await et.save()
                return returnSuccess(res, 100000)
            }
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 900001)
        }
    })
}

module.exports.setEventStatus = async (req, res) => {
    doWithTry(res,async ()=>{
        try {

            let where = { id: req.body.id, mid:req.mid }
            
            let et = await Event.findOne({ where: where })
            if (!et) {
                return returnError(res, 600001)
            } else {
                et.status = req.body.status                
                await et.save()
                return returnSuccess(res, 100000)
            }
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 900001)
        }
    })  
}
module.exports.setEventPublishStatus = async (req, res) => {
    doWithTry(res,async ()=>{
        try {

            let where = { id: req.body.id, mid:req.mid }
            
            let et = await Event.findOne({ where: where })
            if (!et) {
                return returnError(res, 600001)
            } else {
                et.publish_status = req.body.status                
                await et.save()
                return returnSuccess(res, 100000)
            }
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 900001)
        }
    })
}
module.exports.cloneEvent = async (req, res) => {
    doWithTry(res,async ()=>{
        try {
            let where = { id: req.body.id, mid:req.mid }
            
            let et = await Event.findOne({ where: where })
            if (!et) {
                return returnError(res, 600001)
            } else {
                let newet = {
                    name: et.name,
                    description: et.description,
                    template: et.template,
                    html: et.html,
                    form:et.form,
                    mid:req.mid,
                    pay:et.pay,
                    sign:et.sign,
                    apply:et.sign,
                    fee:et.fee,
                    begin:et.begin,
                    end:et.end,
                    photo:et.photo,
                    code: generateCode(6),
                }
                newet = await Event.create(newet)
                return returnResult(res, newet)
            }
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 900001)
        }
    })
}