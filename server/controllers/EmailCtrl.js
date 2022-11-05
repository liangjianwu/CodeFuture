const { returnSuccess, returnError, returnResult } = require("../components/errcode")
const { ErrorHint, Debug } = require("../components");
const db = require('../db/db')
const model = require('../db/model');
const { checkMerchantUser, doWithTry } = require("./utils/Common");
const { getHouse } = require("../service/housesync");
const { templateCompileWithObj } = require("../components/emailtemplatecompile");
const { loadMenu } = require("../components/MenuUtil");
const { AppsList } = require("../configs/AppList");
const EmailQueue = model.EmailQueue
const TaskLog = model.TaskLog
const EmailTemplate = model.EmailTemplate
const Task = model.Task
const UserProfile = model.UserProfile

const Email_Task_Status = ['Editing', 'Waiting', 'Finished', 'Exception']

module.exports.EmailTaskStatus = Email_Task_Status
module.exports.loginLoad = async (req, res) => {
    let content = { serviceMenu: [] }
    let menus = await loadMenu(req.uid, AppsList.emailservice.appid)
    if (menus) {
        content.serviceMenu = menus
        return returnResult(res, content)
    } else {
        return returnError(res, 910001)
    }
}


module.exports.editTemplate = async (req, res) => {

    doWithTry(res, async () => {
        const { title, reply, sender_name, name, description, template, variables, id, datasource } = req.body
        if (id > 0) {
            let where = { id: id, status: 1, mid: req.mid }
            let et = await EmailTemplate.findOne({ where: where })
            if (!et) return returnError(res, 500001)
            et.template = template
            et.variables = variables
            if (title) et.title = title
            if (name) et.name = name
            if (reply) et.reply = reply
            if (sender_name) et.sender_name = sender_name
            if (datasource) et.datasource = datasource
            if (description) et.description = description
            await et.save()
            return returnResult(res, et.id)
        } else {
            let et = await EmailTemplate.create({
                mid: req.mid,
                variables: variables,
                template: template,
                name: name,
                title: title,
                reply: reply,
                sender_name: sender_name,
                datasource: datasource,
                description: description,
            })
            return returnResult(res, et.id)
        }
    })

}
module.exports.loadTemplates = async (req, res) => {
    doWithTry(res, async () => {

        const { page, pagesize, countdata } = req.query

        let where = { status: 1, mid: req.mid }

        let retdata = { total: 0, data: [] }
        countdata == 1 && (retdata.total = await EmailTemplate.count({ where: where }))

        retdata.data = await EmailTemplate.findAll({
            where: where,
            attributes: ['id', 'name', 'reply', 'sender_name', 'description', 'datasource', 'title', 'create_time'],
            limit: pagesize * 1,
            offset: page * pagesize,
            order: [["id", "desc"]],
        })
        return returnResult(res, retdata)

    })
}

module.exports.getTemplate = async (req, res) => {
    doWithTry(res, async () => {


        let where = { id: req.query.id, status: 1, mid: req.mid }

        let et = await EmailTemplate.findOne({ where: where })
        if (!et) {
            return returnError(res, 500001)
        } else {
            return returnResult(res, et)
        }
    })
}
module.exports.removeTemplate = async (req, res) => {
    doWithTry(res, async () => {


        let where = { id: req.body.id, status: 1, mid: req.mid }

        let et = await EmailTemplate.findOne({ where: where })
        if (!et) {
            return returnError(res, 500001)
        } else {
            et.status = 0
            await et.save()
            return returnSuccess(res, 100000)
        }
    })
}
module.exports.cloneTemplate = async (req, res) => {
    doWithTry(res, async () => {


        let where = { id: req.body.id, status: 1, mid: req.mid }

        let et = await EmailTemplate.findOne({ where: where })
        if (!et) {
            return returnError(res, 500001)
        } else {
            let newet = {
                name: et.name,
                description: et.description,
                title: et.title,
                variables: et.variables,
                template: et.template,
                mid: req.mid,
            }
            newet = await EmailTemplate.create(newet)
            return returnResult(res, newet)
        }
    })
}
module.exports.loadTasks = async (req, res) => {
    const taskStatus = (status) => {
        return Email_Task_Status[status]
    }
    doWithTry(res, async () => {
        const { page, pagesize, countdata } = req.query
        let where = { mid: req.mid, type: 'email' }
        let retdata = { total: 0, data: [] }
        countdata == 1 && (retdata.total = await Task.count({ where: where }))
        Task.belongsTo(EmailTemplate, { foreignKey: 'template_id' })
        let data = await Task.findAll({
            where: where,
            attributes: ['id', 'datasource', 'status', 'schedule_time', 'create_time'],
            include: [{ model: EmailTemplate, attributes: ["id", "name", "reply", "sender_name", "datasource", "title"] }],
            limit: pagesize * 1,
            offset: page * pagesize,
            order: [["id", "desc"]],
        })
        data.map(d => {
            retdata.data.push({
                id: d.id, datasource_value: d.datasource, status: d.status, status_desc: taskStatus(d.status), schedule_time: d.schedule_time, customers: d.customers, create_time: d.create_time,
                reply: d.email_template.reply, sender_name: d.email_template.sender_name, datasource: d.email_template.datasource, template_id: d.email_template.id, template_name: d.email_template.name, title: d.email_template.title,
            })
        })
        return returnResult(res, retdata)

    })
}
module.exports.getTask = async (req, res) => {
    doWithTry(res, async () => {

        let where = { mid: req.mid, type: 'email', id: req.query.id }

        let data = await Task.findOne({ where: where })
        if (!data) {
            return returnError(res, 500002)
        }
        let customers = []
        if (data.customers) {
            customers = await UserProfile.findAll({ where: { id: JSON.parse(data.customers) }, attributes: ['id', 'name', 'email'] })
        }
        return returnResult(res, { task: data, customers: customers })

    })
}
module.exports.setTaskStatus = async (req, res) => {
    doWithTry(res, async () => {


        let where = { id: req.body.id, type: "email", mid: req.mid }

        let et = await Task.findOne({ where: where })
        if (!et) {
            return returnError(res, 500002)
        } else {
            if (et.status >= 2) {
                return returnError(res, 500003)
            }
            et.status = req.body.status
            await et.save()
            return returnSuccess(res, 100000)
        }
    })
}
module.exports.editTask = async (req, res) => {
    let { id, type, template_id, datasource, schedule_time, customers } = req.body
    doWithTry(res, async () => {
        let where = { id: template_id, status: 1, }                  
        let et = await EmailTemplate.findOne({ where: where })
        if (!et) {
            return returnError(res, 500001)
        } else {
            let ets = null
            if (id == 0) {
                ets = await Task.create({
                    mid: req.mid, type: type,
                    template_id: template_id, datasource: datasource, schedule_time: schedule_time,
                    customers: JSON.stringify(customers)
                })
            } else {
                let w = { id: id, mid: req.mid, type: "email", type: type }
                ets = await Task.findOne({ where: w })
                if (!ets) {
                    return returnError(res, 500002)
                } else {
                    if ([0, 1].indexOf(ets.status) < 0) {
                        return returnError(res, 500003)
                    }
                    await ets.update({
                        template_id: template_id, datasource: datasource, schedule_time: schedule_time,
                        customers: JSON.stringify(customers), status: 0
                    })
                }
            }
            let html = templateCompileWithObj(et.title, JSON.parse(et.template), JSON.parse(et.variables), {})
            return returnResult(res, { id: ets.id, html: html })
        }
    })
}

module.exports.loadTaskResult = async (req, res) => {
    let { id } = req.query
    doWithTry(res, async () => {
        let where = { mid: req.mid, type: 'email', id: req.query.id }

        let data = await Task.findOne({ where: where })
        if (!data) {
            return returnError(res, 500002)
        }
        let emailqueue = await EmailQueue.findAll({ where: { task_id: id } })
        TaskLog.belongsTo(Customer, { foreignKey: 'customer_id' })
        let tasklog = await TaskLog.findAll({ where: { task_id: id }, include: [{ model: Customer, attributes: ['name', 'email'] }] })
        return returnResult(res, { emailqueue, tasklog })

    })
}