const model = require('../db/model');
const db = require('../db/db')
const EmailTemplate = model.EmailTemplate
const EmailQueue = model.EmailQueue
const Task = model.Task
const TaskLog = model.TaskLog
const UserProfile = model.UserProfile

const { templateCompileWithObj } = require("../components/emailtemplatecompile");
const { ErrorHint, Debug } = require('../components');


module.exports.taskToEmailQueue = async () => {
    try {        
        let tasks = await Task.findAll({ where: { status: 1, type: 'email',schedule_time:{[db.Sequelize.Op.lte]:new Date()} }, limit: 20 })
        //let tasks = await Task.findAll({ where: { status: 1, type: 'email' }, limit: 20 })
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i]
            // Debug([new Date(task.schedule_time),new Date()])
            // if(new Date(task.schedule_time).getTime() > Date.now()) continue            
            try {
                let where = { id: task.template_id, status: 1, }
                let et = await EmailTemplate.findOne({ where: where })
                if (!et) {
                    await task.update({ status: 3 })
                    await TaskLog.create({ task_id: task.id, template_id: task.template_id, user_id: 0, execute_code: "failed", execute_result: "Template does not exist or is invalid" })
                    continue
                } else {
                    let customers = task.customers ? JSON.parse(task.customers) : []
                    let count = 0
                    for (let j = 0; j < customers.length; j++) {
                        try {
                            let cs = await UserProfile.findOne({ where: { user_id: customers[j] } })
                            if (!cs) {
                                await TaskLog.create({ task_id: task.id, template_id: task.template_id, user_id: customers[j], execute_code: "failed", execute_result: "User does not exist" })
                                continue
                            }
                            if (!cs.email) {
                                await TaskLog.create({ task_id: task.id, template_id: task.template_id, user_id: customers[j], execute_code: "failed", execute_result: "User email does not exist" })
                                continue
                            }
                            let ret = {}
                            if (et.datasource && et.datasource != 'none' && task.data) {
                                ret = templateCompileWithObj(et.title,JSON.parse(et.template), JSON.parse(et.variables), JSON.parse(task.data), cs)
                            } else {
                                ret = templateCompileWithObj(et.title,JSON.parse(et.template), JSON.parse(et.variables), {}, cs)
                            }
                            let eq = await EmailQueue.create({
                                mid: task.mid,                                
                                task_id: task.id,
                                customers: JSON.stringify([{ Email: cs.email, Name: cs.name }]),
                                user_id:cs.id,
                                template_id: task.template_id,
                                title: ret.title,
                                reply:et.reply,
                                sender_name:et.sender_name,
                                htmlcontent: ret.html,
                                textcontent: ret.text,
                                schedule_time: new Date(task.schedule_time).getTime(),
                                sended: 0,
                                trytimes: 0,
                            })
                            count += 1
                        } catch (e) {
                            ErrorHint(e)
                            await TaskLog.create({ task_id: task.id, template_id: task.template_id, user_id: customers[j], execute_code: "exception1", execute_result: e.message})
                        }
                    }
                    await task.update({status:count == customers.length?2:3})
                }
            } catch (e) {
                ErrorHint(e)
                await TaskLog.create({ task_id: task.id, template_id: task.template_id, user_id: 0, execute_code: "exception2", execute_result: e.message})
            }
        }
    } catch (e) {
        ErrorHint(e)
    }
}