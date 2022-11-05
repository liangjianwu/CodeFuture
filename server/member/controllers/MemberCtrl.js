const model = require("../../db/model");
const db = require("../../db/db");

const { Util, errorMsg, Debug, ErrorHint, Log, Hint } = require('../../components');
const appConfig = require('../../configs/app.config');
const { returnSuccess, returnError, returnResult } = require("../../components/errcode");
const { doWithTry } = require("../../controllers/utils/Common");

const Member = model.Member;
const MemberInfoStruct = model.MemberInfoStruct
const MemberInfo = model.MemberInfo
const UserBalanceRecord = model.UserBalanceRecord
const UserBalance = model.UserBalance
const UserOrder = model.UserOrder
const CoachSchedule = model.CoachSchedule
const Coach = model.Coach
const ScheduleRecord = model.ScheduleRecord
const Product = model.Product
const Op = db.Sequelize.Op

module.exports.loadMembers = async (req, res) => {
    return doWithTry(res, async () => {
        Member.hasMany(MemberInfo,{foreignKey:'member_id'})
        let members = await Member.findAll({where: { user_id: req.uid, status: {[Op.gte]:0} },include:{model:MemberInfo,attributes:['key','value']} })
        let struct = await MemberInfoStruct.findOne({ where: { mid: req.mid, status: 1 } })
        let mstruct = []
        if (struct) {
            mstruct = JSON.parse(struct.struct)
        }
        mstruct.unshift({
            type: "section", label: "Basic information", items: [
                { type: "input", name: "firstname", label: "First name" },
                { type: "input", name: "lastname", label: "Last name" },
                { type: "radio", name: "gender",  options: 'Male,Female,Other' },
                { type: "date", name: "birthday", label: "Birthday" },
                { type: "input", name: "phone", label: "Phone" },
                { type: "input", name: "email", label: "Email" },
            ]
        })
        return returnResult(res,{ members: members, struct: mstruct })
    })
};

module.exports.editMember = async (req, res) => {
    return doWithTry(res,async ()=>{
        let keys = Object.keys(req.body)
        let k = ['firstname','lastname','gender','birthday','phone','email']
        let kk = ['id','user_id','name','mid','create_time','update_time']
        let data = {}
        let id = req.body.id
        k.map(kk=>{
            req.body[kk] && (data[kk] = req.body[kk])
        })
        if(data.firstname || data.lastname) {
            data.name = data.firstname + ' ' + data.lastname
        }
        if(id > 0) {
            await Member.update(data,{where:{id:id,user_id:req.uid,mid:req.mid}})            
        }else {
            data.user_id = req.uid
            data.mid = req.mid
            Debug(data)
            let mm = await Member.create(data)
            id = mm.id
        }
        for(let i=0;i<keys.length;i++) {
            let key = keys[i]
            if(k.indexOf(key)<0 && kk.indexOf(key)<0) {
                let kv = await MemberInfo.findOne({where:{member_id:id,mid:req.mid,key:key}})
                if(kv) {
                    if(req.body[key].length>255) {
                        kv.extend = req.body[key]
                    }else {
                        kv.value = req.body[key]
                    }
                    await kv.save()
                }else {
                    kv = {member_id:id,mid:req.mid,key:key}
                    if(req.body[key].length>255) {
                        kv.extend = req.body[key]
                    }else {
                        kv.value = req.body[key]
                    }
                    Debug(kv)
                    await MemberInfo.create(kv)
                }
            } 
        }
        return returnResult(res,id)
    })
    
}

module.exports.loadTransactions = async (req,res)=>{
    const { page, pagesize, countdata,bid } = req.query
    doWithTry(res,async()=>{
        UserBalanceRecord.hasOne(Member,{sourceKey:'member_id',foreignKey:'id',targetKey:'id'})
        UserBalanceRecord.hasOne(UserBalance,{sourceKey:'balance_id',foreignKey:'id',targetKey:'id'})
        UserBalanceRecord.hasOne(UserOrder,{sourceKey:'order',foreignKey:'id'})
        let retdata = { total: 0, data: [] }
        let where = {user_id:req.uid,status:1}
        if(bid>0) {where.balance_id = bid}
        if (countdata == 1) {
            retdata.total = await UserBalanceRecord.count({where:where})
        }
        retdata.data = await UserBalanceRecord.findAll({where:where,
            attributes:["id", "balance_id", "member_id", "amount", "pre_balance", "action", "note", "refer", "invoice", "create_time", "status","create_time"],
            include:[
                {model:Member,attributes:['id','name'],required:false},
                {model:UserBalance,attributes:['id','type']},
                {model:UserOrder,attributes:['id','product_name','order_date','count'],required:false}
            ],
            limit:Number(pagesize),
            offset:page*pagesize,
            order:[[UserOrder,'order_date','desc']]
        })
        return returnResult(res,retdata)
    })
}
module.exports.loadBalance = async(req,res) => {
    doWithTry(res,async()=>{
        let ts = await UserBalance.findAll({attributes:['id','user_id','member_id','type','balance'],where:{user_id:req.uid,status:1}})
        return returnResult(res,ts)
    })
}

module.exports.loadSchedule = async(req,res)=>{
    let fromDays = req.query.from
    doWithTry(res, async () => {        
        ScheduleRecord.hasOne(Member,{sourceKey:'member_id',targetKey:'id',foreignKey:'id'})
        ScheduleRecord.hasOne(Coach,{sourceKey:'coach_id',targetKey:'id',foreignKey:'id'})
        ScheduleRecord.hasOne(Product,{sourceKey:'product_id',targetKey:'id',foreignKey:'id'})
        let date= new Date()
        if(fromDays>0) {
            date.setDate(date.getDate()+fromDays)
        }
        let from = date.toISOString().substring(0,10)
        date.setDate(date.getDate()+7)
        let to = date.toISOString().substring(0,10)
        let where = { mid: req.mid, status: 1,[db.Sequelize.Op.and]:[{sdate:{[db.Sequelize.Op.gte]:from},sdate:{[db.Sequelize.Op.lt]:to}}] }
        let schedules = await ScheduleRecord.findAll({ where, 
            include:[
                {model:Member,where:{user_id:req.uid,status:{[Op.gte]:0}},attributes:["id","name"],required:true},
                {model:Coach,attributes:["id","name"],required:true},
                {model:Product,attributes:["id","name"],required:true}
            ],
            order: [['begintime', 'asc'],['product_id','asc']] 
        })        
        
        return returnResult(res, schedules)
    })
}
module.exports.loadSchedules = async(req,res)=>{
    let fromDays = req.query.from
    doWithTry(res, async () => {        
        ScheduleRecord.hasOne(Coach,{sourceKey:'coach_id',targetKey:'id',foreignKey:'id'})
        let date= new Date()
        if(fromDays>0) {
            date.setDate(date.getDate()+fromDays)
        }
        let from = date.toISOString().substring(0,10)
        date.setDate(date.getDate()+7)
        let to = date.toISOString().substring(0,10)        
        let where = { mid: req.mid, status: 1,[db.Sequelize.Op.and]:[{sdate:{[db.Sequelize.Op.gte]:from},sdate:{[db.Sequelize.Op.lt]:to}}] }
        let schedules = await ScheduleRecord.findAll({ where, 
            include:[                
                {model:Coach,attributes:["id","name"],required:true},                
            ],
            order: [[Coach,'name','asc'],['begintime', 'asc']] 
        })
        return returnResult(res, schedules)
    })
}
// module.exports.loadSchedule = async(req,res)=>{
//     doWithTry(res, async () => {        
//         CoachSchedule.hasOne(Member,{sourceKey:'member_id',targetKey:'id',foreignKey:'id'})
//         CoachSchedule.hasOne(Coach,{sourceKey:'coach_id',targetKey:'id',foreignKey:'id'})
//         CoachSchedule.hasOne(Product,{sourceKey:'product_id',targetKey:'id',foreignKey:'id'})
//         let from = new Date().toLocaleDateString()        
//         // f = getSunday(from)
//         // t = getSatuday(from)
//         let where = { mid: req.mid, status: 1 }
//         where.to = { [db.Sequelize.Op.or]: [{ [db.Sequelize.Op.gte]: from }, { [db.Sequelize.Op.is]: null }] }
//         //where.from = { [db.Sequelize.Op.or]: [{ [db.Sequelize.Op.lte]: t }, { [db.Sequelize.Op.is]: null }] }        
//         let schedules = await CoachSchedule.findAll({ where, 
//             include:[
//                 {model:Member,where:{user_id:req.uid,status:{[Op.gte]:0}},attributes:["id","name"],required:true},
//                 {model:Coach,attributes:["id","name"],required:true},
//                 {model:Product,attributes:["id","name"],required:true}
//             ],
//             order: [['begintime', 'asc'],['product_id','asc']] 
//         })        
        
//         return returnResult(res, schedules)
//     })
// }