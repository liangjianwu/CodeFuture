const { returnSuccess, returnError, returnResult } = require("../components/errcode")
const { ErrorHint, Debug } = require("../components");
const md5 = require("md5");
const db = require('../db/db')
const model = require('../db/model');
const { doWithTry } = require("./utils/Common");

const CoachSchedule = model.CoachSchedule
const Coach = model.Coach
const UserOrder = model.UserOrder
const Product = model.Product
const Member = model.Member
const ScheduleRecord = model.ScheduleRecord

module.exports.loadCoaches = {
    get: async (req, res) => {
        doWithTry(res, async () => {
            let coaches = await Coach.findAll({ attributes: ['id', 'name', 'email', 'phone', 'currentminutes', 'currentmonth', 'create_time'], where: { mid: req.mid, status: 1 } })
            return returnResult(res, coaches)
        })
    }
}
module.exports.editCoach = async (req, res) => {
    doWithTry(res, async () => {
        let { id } = req.body
        delete req.body['id']
        if (req.body.passwd) {
            req.body.passwd = md5(req.body.passwd)
        }

        req.body.mid = req.mid
        if (id > 0) {
            await Coach.update(req.body, { where: { id: id, mid: req.mid } })
        } else {
            let coach = await Coach.create(req.body)
            id = coach.id
        }
        return returnResult(res, id)
    })
}

module.exports.removeCoach = async (req, res) => {
    doWithTry(res, async () => {
        await Coach.update({ status: 0 }, { where: { id: req.query.id, mid: req.mid } })
        return returnResult(res, req.query.id)
    })
}
module.exports.loadCoachClassTime = {
    get: async (req, res) => {
        let { id, page, pagesize, countdata } = req.query
        doWithTry(res, async () => {
            let ret = { total: 0, data: [] }
            if (countdata == 1) {
                ret.total = await UserOrder.count({ where: { mid: req.mid, coach_id: id } })
            }
            ret.data = await UserOrder.findAll({
                where: { mid: req.mid, coach_id: id },
                attributes: ['id', 'member_name', 'member_id', 'user_id', 'product_name', [db.sequelize.literal('count/peoples'), 'count'], 'order_date'],
                limit: Number(pagesize),
                offset: pagesize * page,
                order: [['id', 'desc']]
            })
            return returnResult(res, ret)
        })
    }
}

module.exports.loadCoachRecord = {
    get: async (req, res) => {
        let { id, from, to } = req.query
        let from1 = new Date(from).toUTCString()
        let to1 = new Date(to).toUTCString()
        doWithTry(res, async () => {
            UserOrder.hasOne(Coach, { sourceKey: 'coach_id', foreignKey: "id" })
            UserOrder.hasOne(Product, { sourceKey: 'product_id', foreignKey: "id" })
            let where = { mid: req.mid, product_id: { [db.Sequelize.Op.ne]: 0 }, order_date: { [db.Sequelize.Op.between]: [from1, to1] } }
            if (id > 0) where.coach_id = id
            let data = await UserOrder.findAll({
                attributes: [
                    'coach_id', 'order_date', 'product_id',
                    [db.sequelize.fn('SUM', db.sequelize.literal('count/peoples')), 'duration'],
                    [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'amount'],
                ],
                where: where,
                include: [{ model: Coach, attributes: ['name'] }, { model: Product, attributes: ['name'] }],
                group: ['coach_id', 'order_date', 'product_id']
            })
            let products = await Product.findAll({ attributes: ['id', 'name', 'price', 'minutes'], where: { mid: req.mid, status: 1 } })
            let coaches = await Coach.findAll({ attributes: ['id', 'name'], where: { mid: req.mid, status: 1 } })
            return returnResult(res, { records: data, products: products, coaches: coaches })
        })
    }
}
const getAllWeekDay = (wod, f, t) => {
    let dates = []
    let fdate = new Date(f.getTime() + 6 * 3600000)
    //console.log(fdate)
    let day = fdate.getDay()
    Debug([f, fdate, wod, day])
    let date = wod >= day ? new Date(fdate.setDate(fdate.getDate() + wod - day)) : new Date(fdate.setDate(fdate.getDate() + (7 - (day - wod))))
    let tdate = new Date(t.getTime() + 6 * 3600000)
    while (date <= tdate) {
        let m = date.getMonth() + 1
        let d = date.getDate()
        dates.push(date.getFullYear() + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d))
        //dates.push(date.toISOString().substring(0,10))
        date = new Date(date.setDate(date.getDate() + 7))
    }
    return dates
}
const addSchedule = async (data) => {
    try {
        let cs = await CoachSchedule.create(data)
        if (cs) {
            let dates = getAllWeekDay(cs.wod, cs.from, cs.to)
            for (let i = 0; i < dates.length; i++) {
                await ScheduleRecord.create({
                    schedule_id: cs.id,
                    plan_code: cs.plan_code,
                    coach_id: cs.coach_id,
                    member_id: cs.member_id,
                    product_id: cs.product_id,
                    sdate: dates[i],
                    wod: cs.wod,
                    begintime: cs.begintime,
                    duration: cs.duration,
                    original: 1,
                    mid: cs.mid,
                })
            }
        }
    } catch (e) {
        throw e
    }

}

module.exports.addSchedule = async (req, res) => {
    let { from, to, begintime, duration, coach_id, product_id, members, wods } = req.body
    doWithTry(res, async () => {
        let plan_code = Date.now()
        for (let i = 0; i < wods.length; i++) {
            let wod = wods[i]
            if (members && members.length > 0) {
                for (let j = 0; j < members.length; j++) {
                    let member = members[j]
                    let data = { plan_code: plan_code, from: from, to: to, begintime: begintime, mid: req.mid, duration: duration, coach_id: coach_id, product_id: product_id, member_id: member, wod: wod }
                    await addSchedule(data)
                }
            } else {
                let data = { plan_code: plan_code, from: from, to: to, begintime: begintime, mid: req.mid, duration: duration, coach_id: coach_id, product_id: product_id, member_id: 0, wod: wod }
                await addSchedule(data)
            }
        }
        return returnResult(res, "success")
    })
}


module.exports.loadSchedule = {
    get: async (req, res) => {
        function getSunday(d) {
            d = new Date(d + " 12:00:00");
            var day = d.getDay()
            diff = d.getDate() - day
            return new Date(d.setDate(diff)).toISOString().split('T')[0];
        }
        function getSatuday(d) {
            d = new Date(d + " 12:00:00")
            d1 = new Date(d.getFullYear(), d.getMonth() + 1, 0)
            var day = d1.getDay()
            diff = d1.getDate() + (6 - day)
            return new Date(d.setDate(diff)).toISOString().split('T')[0]
        }
        let { coach_id, member_id, from, data } = req.query


        doWithTry(res, async () => {
            let nd = new Date()
            from = from ? (from.substring(0, 7) + '-01') : (nd.getFullYear() + '-' + (nd.getMonth() + 1) + '-01')
            f = getSunday(from)
            t = getSatuday(from)
            let where = { mid: req.mid, status: 1 }
            coach_id > 0 && (where.coach_id = coach_id)
            member_id > 0 && (where.member_id = member_id)
            where.sdate = { [db.Sequelize.Op.or]: [{ [db.Sequelize.Op.gte]: f }, { [db.Sequelize.Op.lte]: t }] }
            let ret = {}
            ret.schedules = await ScheduleRecord.findAll({ where, order: [['sdate', 'asc'], ['begintime', 'asc'], ['product_id', 'asc']] })
            if (data == 1) {
                ret.products = await Product.findAll({ attributes: ['id', 'name', 'coach_id'], where: { mid: req.mid, status: 1, coach_id: { [db.Sequelize.Op.gt]: 0 } }, limit: 100 })
                ret.members = await Member.findAll({ attributes: ['id', 'name', 'level'], where: { mid: req.mid, status: { [db.Sequelize.Op.gt]: 0 } }, limit: 1000 })
                ret.coaches = await Coach.findAll({ attributes: ['id', 'name'], where: { mid: req.mid, status: 1 }, limit: 100 })
            }
            ret.from = f
            ret.to = t
            return returnResult(res, ret)
        })
    }
}
// module.exports.loadSchedules = async (req, res) => {
//     function getSunday(d) {
//         d = new Date(d + " 12:00:00");
//         var day = d.getDay()
//         diff = d.getDate() - day
//         return new Date(d.setDate(diff)).toLocaleDateString();
//     }
//     function getSatuday(d) {
//         d = new Date(d + " 12:00:00")
//         d1 = new Date(d.getFullYear(), d.getMonth() + 1, 0)
//         var day = d1.getDay()
//         diff = d1.getDate() + (6 - day)
//         return new Date(d.setDate(diff)).toLocaleDateString()
//     }
//     let { coach_id, member_id, from, data } = req.query


//     doWithTry(res, async () => {
//         let nd = new Date()
//         from = from ? (from.substring(0,7)+'-01') : (nd.getFullYear() + '-' + (nd.getMonth()+1) + '-01')        
//         f = getSunday(from)
//         t = getSatuday(from)
//         let where = { mid: req.mid, status: 1 }
//         coach_id > 0 && (where.coach_id = coach_id)
//         member_id > 0 && (where.member_id = member_id)
//         where.to = { [db.Sequelize.Op.or]: [{ [db.Sequelize.Op.gte]: f }, { [db.Sequelize.Op.is]: null }] }
//         where.from = { [db.Sequelize.Op.or]: [{ [db.Sequelize.Op.lte]: t }, { [db.Sequelize.Op.is]: null }] }
//         let ret = {}
//         ret.schedules = await CoachSchedule.findAll({ where, order: [['begintime', 'asc'],['product_id','asc']] })
//         if (data == 1) {
//             ret.products = await Product.findAll({ attributes: ['id', 'name', 'coach_id'], where: { mid: req.mid, status: 1, coach_id: { [db.Sequelize.Op.gt]: 0 } }, limit: 100 })
//             ret.members = await Member.findAll({ attributes: ['id', 'name'], where: { mid: req.mid, status: { [db.Sequelize.Op.gt]: 0 } }, limit: 1000 })
//             ret.coaches = await Coach.findAll({ attributes: ['id', 'name'], where: { mid: req.mid, status: 1 }, limit: 100 })
//         }
//         ret.from = f
//         ret.to = t
//         return returnResult(res, ret)
//     })
// }
module.exports.scheduleStatus = async (req, res) => {
    let { id, status } = req.body
    doWithTry(res, async () => {
        let ret = await CoachSchedule.update({ status: status }, { where: { mid: req.mid, id: id } })
        return returnSuccess(res, 100000)
    })
}

module.exports.deleteSchedule = async (req, res) => {
    let { id, type, option } = req.body
    doWithTry(res, async () => {
        let sr = await ScheduleRecord.findOne({ where: { mid: req.mid, id: id } })
        if (sr) {
            if (option == 0) {
                type === 'plan' && await ScheduleRecord.update({ status: 0 }, { where: { mid: req.mid, plan_code: sr.plan_code, wod: sr.wod, sdate: sr.sdate, begintime: sr.begintime, duration: sr.duration } })
                type === 'member' && await sr.update({ status: 0 })
            } else if (option == 1) {
                type === 'plan' && await ScheduleRecord.update({ status: 0 }, { where: { mid: req.mid, plan_code: sr.plan_code, wod: sr.wod, sdate: { [db.Sequelize.Op.gte]: sr.sdate }, begintime: sr.begintime, duration: sr.duration } })
                type === 'member' && await ScheduleRecord.update({ status: 0 }, { where: { mid: req.mid, plan_code: sr.plan_code, member_id: sr.member_id, wod: sr.wod, sdate: { [db.Sequelize.Op.gte]: sr.sdate }, begintime: sr.begintime, duration: sr.duration } })
            } else if (option == 2) {
                type === 'plan' && await ScheduleRecord.update({ status: 0 }, { where: { mid: req.mid, plan_code: sr.plan_code, wod: sr.wod, begintime: sr.begintime, duration: sr.duration } })
                type === 'member' && await ScheduleRecord.update({ status: 0 }, { where: { mid: req.mid, plan_code: sr.plan_code, member_id: sr.member_id, begintime: sr.begintime, duration: sr.duration } })
            }
            return returnResult(res, 0)
        } else {
            return returnError(res, 800001)
        }
    })
}
const addMoreMembersToSchedule = async (mid, members, schedule, data, option, date) => {
    let { begintime, duration, coach_id, product_id, wod } = data
    Debug(data)
    Debug([schedule.coach_id, schedule.product_id])
    for (let j = 0; j < members.length; j++) {
        let member = members[j]
        let data = {
            plan_code: schedule.plan_code, mid: mid,
            from: option != 2 ? date : schedule.from,
            to: option == 0 ? date : schedule.to,
            begintime: begintime ? begintime : schedule.begintime,
            duration: duration ? duration : schedule.duration,
            coach_id: coach_id ? coach_id : schedule.coach_id,
            product_id: product_id ? product_id : schedule.product_id,
            member_id: member,
            wod: wod ? wod : schedule.wod
        }
        addSchedule(data)
    }
}
module.exports.editSchedule = async (req, res) => {
    let { begintime, duration, coach_id, product_id, members, id, type, option } = req.body
    doWithTry(res, async () => {
        let sr = await ScheduleRecord.findOne({ where: { mid: req.mid, id: id } })
        if (sr) {
            let schedule = await CoachSchedule.findOne({ where: { id: sr.schedule_id } })
            let data = {}
            data.begintime = begintime ? begintime : sr.begintime
            data.duration = duration ? duration : sr.duration
            data.coach_id = coach_id ? coach_id : sr.coach_id
            data.product_id = product_id ? product_id : sr.product_id

            if (option == 0) {
                type === 'member' && await sr.update(data)
                if (type === 'plan') {
                    await ScheduleRecord.update(data, { where: { mid: req.mid, plan_code: sr.plan_code, sdate: sr.sdate, wod: sr.wod, begintime: sr.begintime, duration: sr.duration, product_id: sr.product_id } })
                    members && members.length > 0 && addMoreMembersToSchedule(req.mid, members, schedule, data, option, sr.sdate)
                }
            } else if (option == 1) {
                //type === 'plan' && await ScheduleRecord.update({status:0},{where:{mid:req.mid,plan_code:sr.plan_code,wod:sr.wod,sdate:{[db.Sequelize.Op.gte]:sr.sdate}}})
                if (type === 'plan') {
                    await ScheduleRecord.update(data, { where: { mid: req.mid, plan_code: sr.plan_code, wod: sr.wod, sdate: { [db.Sequelize.Op.gte]: sr.sdate }, wod: sr.wod, begintime: sr.begintime, duration: sr.duration, product_id: sr.product_id } })
                    members && members.length > 0 && addMoreMembersToSchedule(req.mid, members, schedule, data, option, sr.sdate)
                }
                type === 'member' && await ScheduleRecord.update(data, { where: { mid: req.mid, plan_code: sr.plan_code, member_id: sr.member_id, wod: sr.wod, sdate: { [db.Sequelize.Op.gte]: sr.sdate }, wod: sr.wod, begintime: sr.begintime, duration: sr.duration }, wod: sr.wod, begintime: sr.begintime, duration: sr.duration, product_id: sr.product_id })
            } else if (option == 2) {
                //type === 'plan' && await ScheduleRecord.update({status:0},{where:{mid:req.mid,plan_code:sr.plan_code,wod:sr.wod}})
                if (type === 'plan') {
                    await ScheduleRecord.update(data, { where: { mid: req.mid, plan_code: sr.plan_code, wod: sr.wod, wod: sr.wod, begintime: sr.begintime, duration: sr.duration, product_id: sr.product_id } })
                    members && members.length > 0 && addMoreMembersToSchedule(req.mid, members, schedule, data, option, sr.sdate)
                }
                type === 'member' && await ScheduleRecord.update(data, { where: { mid: req.mid, plan_code: sr.plan_code, member_id: sr.member_id, wod: sr.wod, begintime: sr.begintime, duration: sr.duration, product_id: sr.product_id } })
            }
            return returnResult(res, 0)
        } else {
            return returnError(res, 800001)
        }
    })
}