
const model = require('../db/model')
const { Op } = require("sequelize");
const appConfig = require('../configs/app.config');
const md5 = require('md5');
const { ErrorHint, Debug } = require('../components');
const { templateCompile, templateCompileWithObj } = require('../components/emailtemplatecompile');
const mailjet = require('node-mailjet').connect(appConfig.mailjet.app_key, appConfig.mailjet.secret_key)
const MUserVerify = model.MUserVerify
const MUserProfile = model.MUserProfile
const UserVerify = model.UserVerify
const UserProfile = model.UserProfile
const EmailTemplate = model.EmailTemplate
const EmailQueue = model.EmailQueue
const EmailLog = model.EmailLog

const sendEmailWithMailJet = async (receivers, title, txtcontent, htmlcontent,reply,sender_name) => {
    //Debug("Begin Send:"+Date.now())
    try {
        // let mailjet = require('node-mailjet')
        //     .connect('3fcf12c6fdbe5f1c8479f29bbf317879', '3b1b1dcb12ff052367d43e57af122889')
        let ret = await mailjet
            .post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "servify.info@gmail.com",
                            "Name": sender_name?sender_name:"Servify customer service"
                        },
                        "To": receivers,
                        "Subject": title,
                        "TextPart": txtcontent, // plain text body
                        "HTMLPart": htmlcontent, // html body       
                        "Headers":{
                            "Reply-To":reply?reply:'servify.info@gmail.com'
                        }                 
                    }
                ]
            })
        //Debug("Sended:"+Date.now())
        //Debug(ret)
        if (ret && ret.body && ret.body.Messages && ret.body.Messages[0] && ret.body.Messages[0].Status == 'success') {
            return { success: true, data: ret }
        } else {
            return { success: false, data: ret }
        }
    } catch (err) {
        ErrorHint(err)
        return { success: false, data: err }
    }
}
const clearVerifyEmail = async () => {
    try {
        MUserVerify.belongsTo(MUserProfile, { foreignKey: 'user_id', targetKey: 'user_id' })
        let uvs = await MUserVerify.findAll({
            attributes: ['id', 'code', 'item', 'action'],
            where: { send_status: 0, type: 'email' },
            include: [{ model: MUserProfile, attributes: ['firstname', 'lastname'] }]
        })
        let regMailTemplate = await EmailTemplate.findOne({where:{mid:0,name:'Email-Code'}})        
        for (let i in uvs) {
            let uv = uvs[i]
            let name = uv.muser_profile.firstname + ' ' + uv.muser_profile.lastname
            //let values = [name,name,uv.code]
            let content = templateCompileWithObj(regMailTemplate.title,JSON.parse(regMailTemplate.template),JSON.parse(regMailTemplate.variables),{code:uv.code},{name:name})
            let eq = await EmailQueue.create({
                mid:uv.mid,
                user_id:0,
                task_id:0,
                customers:JSON.stringify([{Email:uv.item,Name:uv.muser_profile.firstname+' ' + uv.muser_profile.lastname}]),
                template_id:regMailTemplate.id,
                template_values:JSON.stringify({code:uv.code}),
                title:content.title,
                reply:regMailTemplate.reply,
                sender_name:regMailTemplate.sender_name,
                htmlcontent:content.html,
                textcontent:content.text,
                schedule_time:0,
                sended:0,
                trytimes:0,
            })
            uv.send_status = 1
            await uv.save()
            //Debug("Write to email queue, the reciever is "+ eq.customers)
        }
    }catch(e){
        ErrorHint(e)        
    }
}
const clearUserVerifyEmail = async () => {
    try {
        UserVerify.belongsTo(UserProfile, { foreignKey: 'user_id', targetKey: 'user_id' })
        let uvs = await UserVerify.findAll({
            attributes: ['id','user_id','code', 'mid','item', 'action'],
            where: { send_status: 0, type: 'email' },
            include: [{ model: UserProfile, attributes: ['name'] }],
            limit:50,
        })        
        
        for (let i in uvs) {
            let uv = uvs[i]
            let name = uv.user_profile?uv.user_profile.name:'unknown'
            let regMailTemplate = await EmailTemplate.findOne({where:{mid:uv.mid,name:'Email-Code'}})        
            if(!regMailTemplate) {                
                regMailTemplate = await EmailTemplate.findOne({where:{mid:0,name:'Email-Code'}})        
                if(!regMailTemplate) {
                    ErrorHint("no template")
                    continue
                }
            }
            //let values = [name,name,uv.code]
            let content = templateCompileWithObj(regMailTemplate.title,JSON.parse(regMailTemplate.template),JSON.parse(regMailTemplate.variables),{code:uv.code},{name:name})
            let eq = await EmailQueue.create({
                mid:uv.mid,
                user_id:uv.user_id,
                task_id:0,
                customers:JSON.stringify([{Email:uv.item,Name:uv.user_profile.name}]),
                template_id:regMailTemplate.id,
                template_values:JSON.stringify({code:uv.code}),
                title:content.title,
                reply:regMailTemplate.reply,
                sender_name:regMailTemplate.sender_name,
                htmlcontent:content.html,
                textcontent:content.text,
                schedule_time:0,
                sended:0,
                trytimes:0,
            })
            uv.send_status = 1
            await uv.save()
            //Debug("Write to email queue, the reciever is "+ eq.customers)
        }
    }catch(e){
        ErrorHint(e)        
    }
}
const checkAndSendEmail = async () => {
    let mails = { success: [], failed: [] }

    let uvs = await EmailQueue.findAll({ where: { schedule_time:{[Op.lte]:Date.now()}, sended: 0, trytimes: { [Op.lt]: appConfig.email_try_count } }, order: [['trytimes'], ['id']], limit: 10 })
    for (let i in uvs) {
        let uv = uvs[i]
        try {
            //Debug([uv.schedule_time,Date.now()])            
            let rs = uv.customers
            if (rs && rs.length > 0) {
                rs = JSON.parse(rs)
            } else {
                await uv.update({ sended: -1 })
                continue
            }
            let ret = await sendEmailWithMailJet(rs, uv.title, uv.textcontent, uv.htmlcontent,uv.reply,uv.sender_name)
            //Debug(ret)
            if (ret.success) {
                await uv.update({ sended: 1,trytimes:uv.trytimes+1 })
                await EmailLog.create({email_queue_id:uv.id,result:'success',note:''})
                mails.success.push(uv.customers)
            } else {
                await uv.update({ trytimes: uv.trytimes + 1 })
                await EmailLog.create({email_queue_id:uv.id,result:'failed',note:JSON.stringify(ret)})
                //Debug(ret)
                mails.failed.push(uv.customers)
            }
        } catch (error) {
            await uv.update({ sended: -2,trytimes:uv.trytimes+1 })
            await EmailLog.create({email_queue_id:uv.id,result:'exception',note:error.message})
            ErrorHint(error)
            mails.failed.push(uv.customers)
        }
    }
    return mails
}
module.exports.clearVerifyEmail = clearVerifyEmail
module.exports.clearUserVerifyEmail = clearUserVerifyEmail
module.exports.checkAndSendEmail = checkAndSendEmail
