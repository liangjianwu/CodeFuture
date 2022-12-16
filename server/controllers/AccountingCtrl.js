const { returnResult, returnError, returnSuccess } = require("../components/errcode")
const model = require("../db/model");
const { AppsList } = require("../configs/AppList");
const { loadMenu } = require("../components/MenuUtil");
const { ErrorHint, Debug, errorMsg } = require("../components");
const db = require("../db/db");
const { doWithTry } = require("./utils/Common");
const Coach = model.Coach
const Product = model.Product
const UserOrder = model.UserOrder
const Member = model.Member
const User = model.User
const UserBalance = model.UserBalance
const BalanceType = model.BalanceType
const UserBalanceSnapshot = model.UserBalanceSnapshot
const UserProfile = model.UserProfile
const UserBalanceRecord = model.UserBalanceRecord
const MemberGroup = model.MemberGroup
const Group = model.Group
const op = db.Sequelize.Op
module.exports.loginLoad = {
    get: async (req, res) => {
        let content = { serviceMenu: [] }
        let menus = await loadMenu(req.uid, AppsList.accounting.appid)
        if (menus) {
            content.serviceMenu = menus
            return returnResult(res, content)
        } else {
            return returnError(res, 910001)
        }
    }
}
module.exports.loadMembers = {
    get: async (req, res) => {
        let { page, pagesize, countdata } = req.query
        pagesize = Number(pagesize)
        page = Number(page)
        let uid = req.uid
        doWithTry(res, async () => {
            let where = { mid: req.mid, status: { [op.ne]: 3 } }
            let ret = { total: 0 }
            Member.hasMany(UserBalance, { foreignKey: 'user_id', sourceKey: 'user_id', targetKey: 'user_id' })
            Member.belongsTo(UserProfile, { foreignKey: 'user_id', targetKey: 'user_id' })
            Member.belongsTo(User, { foreignKey: "user_id" })
            if (countdata) {
                ret.total = await Member.count({
                    where: where, include: [
                        { model: User, where: { status: { [op.ne]: 3 } } }
                    ]
                })
            }
            //ret.data = await db.sequelize.query('select A.id,A.membership,B.lastname,B.name,A.create_time,A.status,B.City from merchant_customer A,customer B where:where,order:'id desc',limit:pagesize,offset:page*pagesize})        
            ret.data = await Member.findAll({
                attributes: ['id', 'user_id', 'birthday', 'gender', 'name', 'status', 'level'],
                where: where,
                include: [
                    { model: UserBalance, where: { status: 1, mid: req.mid }, attributes: ['balance', 'type', 'member_id', 'update_time'], required: false },
                    { model: UserProfile, attributes: ['name', 'phone'] },
                    { model: User, attributes: ['id'], where: { status: 1 } }
                ],
                order: [['id', 'desc']],
                limit: pagesize, offset: page * pagesize,
            })
            return returnResult(res, ret)
        })
    }
}
// module.exports.loadGroups = async (req, res) => {
//     doWithTry(res, async () => {
//         let where = { mid: req.mid, status: 1 }
//         let ret = await Group.findAll({
//             where: where,
//             order: [['name', 'asc']],
//         })
//         return returnResult(res, ret)
//     })
// }
// module.exports.loadGroupMembers = async (req, res) => {
//     let { groupid } = req.query
//     doWithTry(res, async () => {
//         let members = await MemberGroup.findAll({where:{mid:req.mid,group_id:groupid}})
//         let ids = []
//         for(let i=0;i<members.length;i++) {
//             ids.push(members[i].member_id)
//         }
//         let where = { mid: req.mid, status: { [op.ne]: 3 },id:ids }        
//         Member.hasMany(UserBalance, { foreignKey: 'user_id', sourceKey: 'user_id', targetKey: 'user_id' })
//         Member.belongsTo(UserProfile, { foreignKey: 'user_id', targetKey: 'user_id' })
//         Member.belongsTo(User, { foreignKey: "user_id" })        
//         //ret.data = await db.sequelize.query('select A.id,A.membership,B.lastname,B.name,A.create_time,A.status,B.City from merchant_customer A,customer B where:where,order:'id desc',limit:pagesize,offset:page*pagesize})        
//         let ret = await Member.findAll({
//             attributes: ['id', 'user_id', 'birthday', 'gender', 'name', 'status', 'level'],
//             where: where,
//             include: [
//                 { model: UserBalance, where: { status: 1, mid: req.mid }, attributes: ['balance', 'type', 'member_id', 'update_time'], required: false },
//                 { model: UserProfile, attributes: ['name', 'phone'] },
//                 { model: User, attributes: ['id'], where: { status: 1 } },                
//             ],
//             order: [['id', 'desc']],
//         })
//         return returnResult(res, ret)
//     })
// }
module.exports.loadFamilys = {
    get: async (req, res) => {
        let { page, pagesize, countdata, orderfield, order} = req.query
        
        pagesize = Number(pagesize)
        page = Number(page)
        doWithTry(res, async () => {
            let where = { mid: req.mid, status: 1 }
            let ret = { total: 0 }
            if (countdata) {
                ret.total = await User.count({ where: where })
            }
            User.hasMany(UserBalance, { foreignKey: 'user_id' })
            //User.hasMany(Member, { foreignKey: 'user_id' })
            User.hasOne(UserProfile, { foreignKey: 'user_id' })
            let orderdesc = [['id', order]]
            if (orderfield == 'parent') {
                orderdesc = [[UserProfile, 'name', order]]
            } else if (orderfield == 'balance') {
                orderdesc = [[UserBalance, 'balance', order]]
            }
            ret.data = await User.findAll({
                attributes: ['id'],
                where: where,
                include: [
                    { model: UserProfile, attributes: ['user_id', 'name', 'phone'] },
                    // { model: UserBalance, where: { status: 1 }, attributes: ['balance', 'type', 'member_id', 'update_time'], required: false },
                    //{ model: Member, attributes: ['id', 'name'], where: { status: 1, mid: req.mid }, required: false },                
                ],
                order: orderdesc,
                limit: pagesize, offset: page * pagesize,
            })
            let ids = []
            ret.data.map((row) => {
                ids.push(row.id)
            })
            ret.members = await Member.findAll({ attributes: ['id', 'user_id', 'name', 'status', 'level'], where: { user_id: ids, status: { [op.ne]: 3 } } })
            UserBalance.belongsTo(BalanceType,{foreignKey:"balance_typeid",targetKey:'id'})
            ret.balances = await UserBalance.findAll({ attributes: ['id','user_id','balance','balance_typeid','status'], 
                    where: { user_id: ids, status: { [op.ne]: 3 } } ,
                    include:[{model:BalanceType,attributes:['type','id'],required:false},],
            })
            // ret.balance = await UserBalance.sum('balance', {
            //     where: { mid: req.mid, status: 1 },
            //     //attributes: [[db.Sequelize.fn('sum', db.Sequelize.col('balance')), 'balance']]
            // })
            return returnResult(res, ret)
        })
    }
}
module.exports.userbalance = {
    post: async (req, res) => {
        let { customerid, familyid, amount, balance_typeid, note, date, invoice } = req.body
        return doWithTry(res, async () => {
            if (familyid == 0) {
                let where = { mid: req.mid, id: customerid, status: { [op.ne]: 3 } }
                let mc = await Member.findOne({ where: where })
                if (!mc) {
                    return returnError(res, 400006)
                }
                familyid = mc.user_id
            }
            let bt = await BalanceType.findOne({where:{mid:req.mid,id:balance_typeid}})
            if(!bt) {
                return returnError(res,400001)
            }
            let w = { mid: req.mid, user_id: familyid, balance_typeid: balance_typeid, member_id: 0 }
            let mcb = await UserBalance.findOne({ where: w })
            let originalBalance = 0
            if (!mcb) {
                w.balance = amount
                w.member_id = 0
                mcb = await UserBalance.create(w)
            } else {
                originalBalance = mcb.balance
                mcb.balance = Number(mcb.balance) + Number(amount)
                await mcb.save()
            }
            let order = await UserOrder.create({
                mid: req.mid,
                user_id: familyid,
                balance_typeid:balance_typeid,
                member_id: 0,
                member_name: '',
                product_id: 0,
                product_name: 'recharge',
                product_price: amount,
                coach_id: 0,
                count: 0,
                amount: amount,
                charge: 0,
                order_date: new Date(date),
            })
            await UserBalanceRecord.create({ user_id: familyid, member_id: 0, mid: req.mid,balance_typeid:balance_typeid, balance_id: mcb.id, amount: amount, order: order.id, pre_balance: originalBalance, action: 'recharge', invoice: invoice ? invoice : '', note: note ? note : bt.type, ip: req.requestIp })

            return returnResult(res, { balance_typeid: balance_typeid, balance: mcb.balance })
        })
    }
}
module.exports.recharge = async (req, res) => {
    let { customerid, familyid, amount, type, note, date, invoice } = req.body
    return doWithTry(res, async () => {
        if (familyid == 0) {
            let where = { mid: req.mid, id: customerid, status: { [op.ne]: 3 } }
            let mc = await Member.findOne({ where: where })
            if (!mc) {
                return returnError(res, 400006)
            }
            familyid = mc.user_id
        }
        let w = { mid: req.mid, user_id: familyid, type: type, member_id: 0 }
        let mcb = await UserBalance.findOne({ where: w })
        let originalBalance = 0
        if (!mcb) {
            w.balance = amount
            w.member_id = 0
            mcb = await UserBalance.create(w)
        } else {
            originalBalance = mcb.balance
            mcb.balance = Number(mcb.balance) + Number(amount)
            await mcb.save()
        }
        let order = await UserOrder.create({
            mid: req.mid,
            user_id: familyid,
            member_id: 0,
            member_name: '',
            product_id: 0,
            product_name: 'recharge',
            product_price: amount,
            coach_id: 0,
            count: 0,
            amount: amount,
            charge: 0,
            order_date: new Date(date),
        })
        await UserBalanceRecord.create({ user_id: familyid, member_id: 0, mid: req.mid, balance_id: mcb.id, amount: amount, order: order.id, pre_balance: originalBalance, action: 'recharge', invoice: invoice ? invoice : '', note: note ? note : type, ip: req.requestIp })

        return returnResult(res, { type: type, balance: mcb.balance })
    })
}
module.exports.editTransaction = async (req, res) => {
    const { note, id, invoice, order_date, peoples } = req.body
    return doWithTry(res, async () => {
        let ubr = await UserBalanceRecord.findOne({ where: { id: id, mid: req.mid } })
        if (ubr && (note || invoice)) {
            ubr.note = note ? note : ubr.note
            ubr.invoice = invoice ? invoice : ubr.invoice
            await ubr.save()
        }
        if (ubr && ubr.order > 0) {
            let order = await UserOrder.findOne({ where: { id: ubr.order } })
            //let olddate = order.order_date
            if (order && order_date) {
                order.order_date = order_date
            }
            if (order && peoples > 0) {
                order.peoples = peoples
            }
            if (order && (order_date || peoples > 0)) {
                await order.save()
            }

            // let currentMonth = new Date().toLocaleDateString().substring(0, 7)
            // let orderMonth = order_date.substring(0, 7)
            // let oldMonth = olddate.substring(0, 7)
            // if (order.coach_id > 0 && order.count > 0 && oldMonth != orderMonth) {
            //     let coach = await Coach.findOne({ where: { id: order.coach_id } })
            //     if (coach && currentMonth == orderMonth) {
            //         if (coach.currentmonth != currentMonth) {
            //             coach.currentminutes = order.count
            //             coach.currentmonth = currentMonth
            //         } else {
            //             coach.currentminutes = Number(coach.currentminutes) + Number(order.count)
            //         }
            //         await coach.save()
            //     } else if (coach && oldMonth == currentMonth) {
            //         coach.currentminutes = Number(coach.currentminutes) - Number(order.count)
            //         await coach.save()
            //     }
            // }
        }
        return returnSuccess(res, 100000)
    })
}

module.exports.charge = async (req, res) => {
    const { customers, amount, product_id, count, date, note, peoples, transaction_id } = req.body
    doWithTry(res, async () => {
        // if (transaction_id > 0) {
        //     let r = await UserBalanceRecord.findAll({ where: { refer: transaction_id, status: 1 } })
        //     if (r.length > 0) {
        //         return returnError(res, 400017)
        //     }
        //     let t = await UserBalanceRecord.findOne({ where: { id: transaction_id, status: 1 } })
        //     if (!t || customers.length != 1 || customers[0] != t.member_id) {
        //         return returnError(res, 400015)
        //     }
        //     let order = await UserOrder.findOne({ where: { id: t.order } })
        //     await db.sequelize.transaction(
        //         async transaction => {
        //             try {
        //                 let nn = await UserBalanceRecord.update({ status: 0 }, { where: { id: t.id, status: 1 }, transaction: transaction })
        //                 if (nn != 1) {
        //                     throw new Error("Cancel old order status failed")
        //                 }
        //                 if (t.amount != 0) {
        //                     let nn1 = await UserBalance.update(
        //                         { balance: db.sequelize.fn(Math.abs(t.amount) + '+', db.sequelize.col('balance')) },
        //                         { where: { id: t.balance_id }, transaction: transaction },
        //                     )
        //                     if (nn1 != 1) {
        //                         throw new Error("Cancel old order failed")
        //                     }
        //                 }
        //                 if (order.coach_id > 0) {
        //                     let currentMonth = new Date().toLocaleDateString().substring(0, 7)
        //                     let orderMonth = new Date(order.order_date).toLocaleDateString().substring(0, 7)
        //                     if (currentMonth == orderMonth) {
        //                         await Coach.update({ currentminutes: db.sequelize.fn('-' + order.count + '+', db.sequelize.col('currentminutes')), currentmonth: currentMonth }, { where: { id: order.coach_id }, transaction: transaction })
        //                     }
        //                 }
        //             } catch (e) {
        //                 throw new Error(e.message)
        //             }
        //         }
        //     ).catch(e => {
        //         ErrorHint(e)
        //         return returnError(res, 400005)
        //     })
        // }
        let where = { mid: req.mid, id: customers, status: { [op.ne]: 3 } }
        let mcs = await Member.findAll({ where: where })
        if (mcs.length != customers.length) {
            return returnError(res, 400007)
        }
        let product = null
        if (product_id && product_id > 0) {
            product = await Product.findOne({ where: { id: product_id, mid: req.mid, status: 1 } })
            if (!product) {
                return returnError(res, 400016)
            }
        }
        await db.sequelize.transaction(
            async transaction => {
                try {
                    for (let i = 0; i < mcs.length; i++) {
                        if (product == null || product.chargeto === 'none') {
                            let order = await UserOrder.create({
                                mid: req.mid,
                                user_id: mcs[i].user_id,
                                member_id: mcs[i].id,
                                member_name: mcs[i].name,
                                product_id: product ? product.id : 0,
                                product_name: product ? product.name : '',
                                product_price: product ? product.price : 0,
                                coach_id: product ? product.coach_id : 0,
                                count: count,
                                peoples: peoples,
                                amount: -amount,
                                charge: -amount,
                                order_date: new Date(date),
                            }, { transaction })
                            await UserBalanceRecord.create({
                                mid: req.mid,
                                member_id: mcs[i].id,
                                member_name: mcs[i].name,
                                user_id: mcs[i].user_id,
                                balance_id: 0,
                                amount: -amount,
                                pre_balance: 0,
                                order: order.id + '',
                                action: 'charge',
                                ip: req.requestIp,
                                note: note
                            }, { transaction })
                        } else {
                            let balance = await UserBalance.findOne({ where: { user_id: mcs[i].user_id, type: product.chargeto, status: 1 } })
                            if (!balance) {
                                balance = await UserBalance.create({ user_id: mcs[i].user_id, type: product.chargeto, status: 1, balance: 0, mid: req.mid, member_id: 0 }, { transaction })
                            }
                            let order = await UserOrder.create({
                                mid: req.mid,
                                user_id: mcs[i].user_id,
                                member_id: mcs[i].id,
                                member_name: mcs[i].name,
                                product_id: product.id,
                                product_name: product.name,
                                product_price: product.price,
                                count: count,
                                peoples: peoples,
                                amount: -(Number(count) * 1.0 / Number(product.minutes) * Number(product ? product.price : 0)).toFixed(2),
                                charge: -amount,
                                order_date: new Date(date),
                                coach_id: product.coach_id,
                            }, { transaction })
                            await UserBalanceRecord.create({
                                mid: req.mid,
                                user_id: mcs[i].user_id,
                                member_id: mcs[i].id,
                                balance_id: balance ? balance.id : 0,
                                amount: -amount,
                                pre_balance: balance ? balance.balance : 0,
                                order: order.id + '',
                                action: 'charge',
                                ip: req.requestIp,
                                note: note
                            }, { transaction })
                            if (amount > 0) {
                                await balance.update(
                                    { balance: db.sequelize.fn('-' + amount + '+', db.sequelize.col('balance')) },
                                    { transaction },
                                )
                            }
                        }
                        // if (product && product.coach_id > 0) {
                        //     let currentMonth = new Date().toLocaleDateString().substring(0, 7)
                        //     let orderMonth = date.substring(0, 7)
                        //     if (currentMonth == orderMonth) {
                        //         let coach = await Coach.findOne({ where: { id: product.coach_id } })
                        //         if (coach) {
                        //             if (coach.currentmonth != currentMonth) {
                        //                 coach.currentminutes = count
                        //                 coach.currentmonth = currentMonth
                        //             } else {
                        //                 coach.currentminutes = Number(coach.currentminutes) + Number(count)
                        //             }
                        //             await coach.save()
                        //         }
                        //     }
                        // }
                    }
                } catch (e) {
                    throw new Error(e.message)
                }
            }
        ).then(ret => {
            return returnSuccess(res, 100000)
        }).catch(e => {
            ErrorHint(e)
            return returnError(res, 400005)
        })
    })
}
module.exports.loadtransactions = {
    get: async (req, res) => {
        const { fid, kid, page, pagesize, countdata, orderfield, order, coache, product, from, to } = req.query
        doWithTry(res, async () => {
            UserBalanceRecord.hasOne(Member, { sourceKey: 'member_id', foreignKey: "id" })
            UserBalanceRecord.hasOne(UserProfile, { sourceKey: 'user_id', foreignKey: "user_id" })
            UserBalanceRecord.hasOne(UserBalance, { sourceKey: 'balance_id', foreignKey: "id" })
            UserBalanceRecord.hasOne(UserOrder, { sourceKey: 'order', foreignKey: "id" })
            let where = { mid: req.mid, status: 1 }
            if (fid > 0) {
                where.user_id = fid
            }
            if (fid > 0 && kid > 0) {
                where.member_id = kid
            }
            let owhere = { mid: req.mid }
            if (coache > 0) {
                owhere.coach_id = coache
            }
            if (product > 0) {
                owhere.product_id = product
            }
            if ((coache > 0 || product > 0) && from && to) {
                let from1 = new Date(from).toUTCString()
                let to1 = new Date(to).toUTCString()
                owhere.order_date = { [op.between]: [from1, to1] }
            }
            let retdata = { total: 0, data: [] }
            if (countdata == 1) {
                retdata.total = await UserBalanceRecord.count({
                    where: where,
                    include: [{ model: UserOrder, where: owhere }]
                })
            }
            let orderdesc = orderfield == 'create_time' ? [[UserOrder, 'order_date', order], ['id', order]] : (orderfield == 'parent' ? [[UserProfile, 'name', order], ['id', order]] : (orderfield == 'name' ? [[Member, 'name', order], ['id', order]] : [['id', order]]))
            let ts = await UserBalanceRecord.findAll({
                attributes: ["id", "balance_id", "user_id", "member_id", "amount", "pre_balance", "action", "note", "refer", "invoice", "create_time", "status"],
                where: where,
                include: [
                    { model: Member, attributes: ["name", "status", 'level'], required: false },
                    { model: UserProfile, attributes: ["name"] },
                    { model: UserBalance, attributes: ["type"] },
                    { model: UserOrder, where: owhere },
                ],
                order: orderdesc,
                limit: pagesize * 1,
                offset: page * pagesize,
            })
            ts && ts.map(t => {
                retdata.data.push({
                    id: t.id, amount: t.amount, prebalance: t.pre_balance, balance: (Number(t.pre_balance) + Number(t.amount)).toFixed(2),
                    subject: t.action, note: t.note, refer: t.refer, invoice: t.invoice, status: t.status,
                    create_time: t.create_time,
                    name: t.member?.name,
                    mstatus: t.member?.status,
                    level: t.member?.level,
                    parent: t.user_profile.name,
                    balancetype: t.user_balance ? t.user_balance.type : "other",
                    member_id: t.member_id,
                    user_id: t.user_id,
                    order: t.user_order,
                })
            })
            return returnResult(res, retdata)
        })

    }
}
const loadReferAmount = async (refer) => {
    let refers = await UserBalanceRecord.findAll({ where: { refer: refer, status: 1 } })
    let amount = 0
    for (let i = 0; i < refers.length; i++) {
        item = refers[i]
        amount = amount + Number(item.amount)
        amount = amount + await loadReferAmount(item.id)
    }
    return amount
}
module.exports.loadTransaction = async (req, res) => {
    doWithTry(res, async () => {
        let original = await UserBalanceRecord.findOne({ where: { id: req.body.id, mid: req.mid, status: 1 } })
        if (!original) return returnError(res, 400008)
        let retdata = { refundAmount: 0, customerBalance: 0 }
        retdata.refundAmount = await loadReferAmount(req.body.id)
        let mcb = await UserBalance.findOne({ where: { id: original.balance_id } })
        if (mcb) {
            retdata.customerBalance = mcb.balance
        }
        if (original.order && original.order != null) {
            let order = await UserOrder.findOne({ where: { id: original.order } })
            if (order && order.product_id > 0) {
                let product = await Product.findOne({ where: { id: order.product_id } })
                retdata.product = product
            }
        }
        return returnResult(res, retdata)
    })
}
module.exports.cancelTransaction = async (req, res) => {
    let { id } = req.body
    doWithTry(res, async () => {
        return returnError(res, 400017)
        // let r = await UserBalanceRecord.findAll({ where: { refer: id, status: 1 } })
        // if (r.length > 0) {
        //     return returnError(res, 400017)
        // }
        // let t = await UserBalanceRecord.findOne({ where: { id: id, status: 1 } })
        // if (!t || ['recharge', 'charge'].indexOf(t.action) < 0) {
        //     return returnError(res, 400019)
        // }
        // let order = await UserOrder.findOne({ where: { id: t.order } })
        // await db.sequelize.transaction(
        //     async transaction => {
        //         try {
        //             let nn = await UserBalanceRecord.update({ status: 0 }, { where: { id: t.id, status: 1 }, transaction: transaction })
        //             if (nn != 1) {
        //                 throw new Error("Cancel old order status failed")
        //             }
        //             if (t.amount != 0) {
        //                 if (t.action == 'recharge') {
        //                     let nn1 = await UserBalance.update(
        //                         { balance: db.sequelize.fn('-' + Math.abs(t.amount) + '+', db.sequelize.col('balance')) },
        //                         { where: { id: t.balance_id }, transaction: transaction },
        //                     )
        //                     if (nn1 != 1) {
        //                         throw new Error("Cancel old order failed")
        //                     }
        //                 } else if (t.action == 'charge') {
        //                     let nn1 = await UserBalance.update(
        //                         { balance: db.sequelize.fn(Math.abs(t.amount) + '+', db.sequelize.col('balance')) },
        //                         { where: { id: t.balance_id }, transaction: transaction },
        //                     )
        //                     if (nn1 != 1) {
        //                         throw new Error("Cancel old order failed")
        //                     }
        //                 }
        //             }
        //             if (order.coach_id > 0) {
        //                 let currentMonth = new Date().toLocaleDateString().substring(0, 7)
        //                 let orderMonth = new Date(order.order_date).toLocaleDateString().substring(0, 7)
        //                 if (currentMonth == orderMonth) {
        //                     await Coach.update({ currentminutes: db.sequelize.fn('-' + order.count + '+', db.sequelize.col('currentminutes')), currentmonth: currentMonth }, { where: { id: order.coach_id }, transaction: transaction })
        //                 }
        //             }
        //         } catch (e) {
        //             throw new Error(e.message)
        //         }
        //     }
        // ).then(ret => {
        //     return returnSuccess(res, 100000)
        // }).catch(e => {
        //     ErrorHint(e)
        //     return returnError(res, 400018)
        // })
    })
}
module.exports.refund = async (req, res) => {
    let { refer, amount, note, date } = req.body
    doWithTry(res, async () => {
        let original = await UserBalanceRecord.findOne({ where: { id: refer, mid: req.mid, status: 1 } })
        if (!original) return returnError(res, 400008)

        let referAmount = await loadReferAmount(refer)
        if (Math.abs(original.amount) - Math.abs(referAmount) - Math.abs(amount) < 0) {
            return returnError(res, 400009)
        }
        const mcb = await UserBalance.findOne({ where: { id: original.balance_id } })
        if (!mcb) {
            return returnError(res, 400011)
        }
        amount = Number(original.amount) < 0 ? Number(amount) : -Number(amount)
        // if (Number(mcb.balance) + amount < 0) {
        //     return returnError(res, 400012)
        // }
        let order = null
        let product = null
        if (original.order > 0) {
            order = await UserOrder.findOne({ where: { id: original.order } })
            if (order.product_id > 0) {
                product = await Product.findOne({ where: { id: order.product_id } })
            }
        }
        db.sequelize.transaction(
            async transaction => {
                try {
                    let num = await UserBalance.update({ balance: db.sequelize.fn(amount + '+', db.sequelize.col('balance')) }, { where: { id: mcb.id } }, { transaction })
                    if (num == 1) {
                        let count = product && product.minutes > 0 && product.price > 0 ? (-amount * 1.0 / product.price * product.minutes).toFixed(0) : 0
                        let neworder = await UserOrder.create({
                            mid: req.mid,
                            user_id: original.user_id,
                            member_id: original.member_id,
                            member_name: order ? order.member_name : '',
                            product_id: order ? order.product_id : 0,
                            product_name: order ? order.product_name : '',
                            product_price: order ? order.product_price : 0,
                            count: count,
                            peoples: order ? order.peoples : 1,
                            amount: amount,
                            charge: amount,
                            order_date: new Date(date),
                            coach_id: order ? order.coach_id : 0,
                        })
                        // if (order && order != null && order.coach_id > 0 && count != 0) {
                        //     let currentMonth = new Date().toLocaleDateString().substring(0, 7)
                        //     let orderMonth = new Date(order.order_date).toLocaleDateString().substring(0, 7)
                        //     if (currentMonth == orderMonth) {
                        //         await Coach.update({ currentminutes: db.sequelize.fn(count + '+', db.sequelize.col('currentminutes')), currentmonth: currentMonth }, { where: { id: order.coach_id }, transaction: transaction })
                        //     }
                        // }
                        await UserBalanceRecord.create({
                            balance_id: mcb.id, member_id: original.member_id, user_id: original.user_id, mid: req.mid, order: neworder && neworder != null ? neworder.id : 0,
                            amount: amount, pre_balance: mcb.balance, action: 'refund', note: note, refer: refer, ip: req.requestIp
                        }, { transaction })

                        return returnSuccess(res, 100000)
                    } else {
                        transaction.rollback()
                        return returnError(res, 400013)
                    }
                } catch (e) {
                    transaction.rollback()
                    ErrorHint(e)
                    return returnError(res, 900001)
                }
            }
        ).catch(e => {
            ErrorHint(e)
            return returnError(res, 900001)
        })
    })
}

module.exports.getGroupMembers = {
    get: async (req, res) => {
        let { id, page, pagesize, countdata } = req.query
        doWithTry(res, async () => {
            Member.belongsTo(MemberGroup, { foreignKey: "id", targetKey: 'member_id' })
            Member.belongsTo(UserProfile, { foreignKey: "user_id", targetKey: 'user_id' })
            Member.belongsTo(User, { foreignKey: "user_id" })
            Member.hasMany(UserBalance, { sourceKey: "user_id", foreignKey: 'user_id' })
            let retdata = { total: 0, data: [] }
            if (countdata == 1) {
                retdata.total = await Member.count({
                    where: { mid: req.mid, status: { [op.ne]: 3 } },
                    include: [{
                        model: MemberGroup,
                        where: { mid: req.mid, group_id: id, status: 1 },
                    }, {
                        model: User, attributes: ['id'], where: { status: 1 }
                    }]
                })
            }
            retdata.data = await Member.findAll({
                attributes: ['id', 'name', 'user_id', 'status'],
                where: { mid: req.mid, status: { [op.ne]: 3 } },
                include: [{
                    model: MemberGroup,
                    attributes: ['member_id'],
                    where: { mid: req.mid, group_id: id, status: 1 },
                }, {
                    model: UserBalance, where: { status: 1, mid: req.mid }, attributes: ['balance', 'type', 'member_id', 'update_time'], required: false
                }, {
                    model: UserProfile, attributes: ['name']
                }, {
                    model: User, attributes: ['id'], where: { status: 1 }
                }
                ], order: [['id', 'desc']], limit: 1 * pagesize, offset: page * pagesize
            })
            return returnResult(res, retdata)
        })
    }
}
module.exports.searchMembers = {
    get: async (req, res) => {
        const { value, page, pagesize, countdata } = req.query

        doWithTry(res, async () => {
            Member.belongsTo(UserProfile, { foreignKey: "user_id", targetKey: 'user_id' })
            Member.belongsTo(User, { foreignKey: "user_id" })
            Member.hasMany(UserBalance, { sourceKey: "user_id", foreignKey: 'user_id' })
            let retdata = { total: 0, data: [] }
            if (countdata == 1) {
                retdata.total = await Member.count({
                    where: {
                        mid: req.mid,
                        status: { [op.ne]: 3 },
                        name: { [op.like]: `%${value}%` },
                    },
                    include: [{
                        model: User, attributes: ['id'], where: { status: 1 }
                    }],
                })
            }

            retdata.data = await Member.findAll({
                attributes: ['id', 'name', 'status', 'level'],
                where: {
                    mid: req.mid,
                    status: { [op.ne]: 3 },
                    name: { [op.like]: `%${value}%` },
                },
                include: [{
                    model: UserBalance, where: { status: 1, mid: req.mid }, attributes: ['balance', 'type', 'member_id', 'update_time'], required: false
                }, {
                    model: UserProfile, attributes: ['name']
                }, {
                    model: User, attributes: ['id'], where: { status: 1 }
                }],
                order: [["id", "desc"]],
                limit: pagesize * 1,
                offset: page * pagesize,
            })
            return returnResult(res, retdata)
        })
    }
}
module.exports.searchFamilys = {
    get: async (req, res) => {
        const { value, page, pagesize, countdata } = req.query

        doWithTry(res, async () => {
            User.hasOne(UserBalance, { foreignKey: 'user_id' })
            User.hasMany(Member, { foreignKey: 'user_id' })
            User.hasOne(UserProfile, { foreignKey: 'user_id' })
            let retdata = { total: 0, data: [] }
            if (countdata == 1) {
                retdata.total = await User.count({
                    where: {
                        mid: req.mid,
                        status: 1,
                    },
                    include: [{
                        model: UserProfile,
                        where: {
                            [op.or]: [
                                { name: { [op.like]: `%${value}%` } },
                                { kids: { [op.like]: `%${value}%` } },
                                { email: { [op.like]: `%${value}%` } },
                                { phone: { [op.like]: `%${value}%` } },
                            ]
                        }
                    }]
                })
            }
            retdata.data = await User.findAll({
                attributes: ['id'],
                where: {
                    mid: req.mid,
                    status: 1,
                },
                include: [
                    { model: UserBalance, where: { status: 1, mid: req.mid, type: 'privateclass' }, attributes: ['balance', 'type', 'member_id', 'update_time'], required: false },
                    { model: Member, attributes: ['id', 'name', 'status', 'level'], where: { status: { [op.ne]: 3 }, mid: req.mid }, required: false },
                    {
                        model: UserProfile, attributes: ['name', 'phone', 'user_id'], where: {
                            [op.or]: [
                                { name: { [op.like]: `%${value}%` } },
                                { kids: { [op.like]: `%${value}%` } },
                                { email: { [op.like]: `%${value}%` } },
                                { phone: { [op.like]: `%${value}%` } },
                            ]
                        }
                    }
                ],
                order: [['id', 'desc']],
                limit: Number(pagesize), offset: Number(page) * Number(pagesize),
            })
            return returnResult(res, retdata)
        })

    }
}
module.exports.getReport = {
    get: async (req, res) => {
        let { from, to, orderfield, order } = req.query
        let from1 = new Date(from).toUTCString()
        let to1 = new Date(to).toUTCString()
        doWithTry(res, async () => {
            UserBalanceRecord.hasOne(UserProfile, { sourceKey: 'user_id', foreignKey: "user_id" })
            UserBalanceRecord.hasOne(UserOrder, { sourceKey: 'order', foreignKey: "id" })
            let where = { mid: req.mid, status: 1 }
            let retdata = {}
            retdata.logs = await UserBalanceRecord.findAll({
                attributes: ["id", "user_id", "amount", "invoice", "note", "refer", "create_time"],
                where: where,
                include: [
                    { model: UserProfile, attributes: ["name", 'user_id'] },
                    { model: UserOrder, where: { product_id: 0, order_date: { [op.between]: [from1, to1] } } },
                ],
                order: orderfield == 'parent' ? [[UserProfile, 'name', order]] : [[UserOrder, 'order_date', order ? order : 'desc']],
                limit: 500,
            })
            if (!orderfield && !order) {
                retdata.recharged = 0
                let rechargeuserids = []
                retdata.logs.map(log => {
                    if (rechargeuserids.indexOf(log.user_id) < 0) {
                        rechargeuserids.push(log.user_id)
                    }
                    retdata.recharged += Number(log.amount)
                })
                retdata.rechargedFamilies = rechargeuserids.length
                retdata.charged = await UserOrder.sum('amount', {
                    where: { mid: req.mid, product_id: { [op.ne]: 0 }, order_date: { [op.between]: [from1, to1] } },
                })
                // retdata.minutes = await UserOrder.sum(db.sequelize.literal('count/peoples'), {
                //     where: { mid: req.mid, product_id: { [op.ne]: 0 }, amount: { [op.ne]: 0 }, order_date: { [op.between]: [from1, to1] } },
                // })
                let mm = await db.sequelize.query('select sum(count/peoples) as count from user_order where mid=' + req.mid + ' and product_id != 0 and amount != 0 and order_date between "' + from + '" and "' + to + '"')
                //Debug(mm)
                if (mm && mm.length > 0) {
                    retdata.minutes = mm[0][0].count
                } else {
                    retdata.minutes = 0
                }
                //retdata.charged = retdata.charged[0].amount
            }
            return returnResult(res, retdata)
        })
    }
}
// module.exports.getReport1 = async (req, res) => {
//     let { from, to, orderfield, order } = req.query
//     let from1 = new Date(from).toUTCString()
//     let to1 = new Date(to).toUTCString()
//     doWithTry(res, async () => {
//         UserOrder.hasOne(UserProfile, { sourceKey: 'user_id', foreignKey: "user_id" })
//         UserOrder.hasOne(UserBalanceRecord, { foreignKey: "order" })
//         let where = { mid: req.mid, product_id:0,'order_date': { [op.between]: [from1, to1] } }
//         let retdata = {logs:[]}
//         let logs = await UserOrder.findAll({
//             attributes: ["id", "user_id", "order_date","product_id"],
//             where: where,            
//             include: [
//                 { model: UserProfile, attributes: ["name", 'user_id'] },
//                 { model: UserBalanceRecord, attributes:["id","amount","invoice","note",]},
//             ],
//             order: orderfield == 'parent' ? [[UserProfile, 'name', order]] : [['order_date', order ? order : 'desc']],
//             limit: 500,
//         })        
//         if (!orderfield && !order) {
//             retdata.recharged = 0
//             let rechargeuserids = []            
//             logs.map((log,idx) => {
//                 if (rechargeuserids.indexOf(log.user_id) < 0) {
//                     rechargeuserids.push(log.user_id)
//                 }
//                 retdata.recharged += Number(log.user_balance_record.amount)
//                 let newlog = {}
//                 newlog.order_id = log.id
//                 newlog.id = log.user_balance_record.id
//                 newlog.amount = log.user_balance_record.amount
//                 newlog.invoice = log.user_balance_record.invoice
//                 newlog.note = log.user_balance_record.note                
//                 newlog.name = log.user_profile.name
//                 newlog.user_id = log.user_id
//                 newlog.order_date = log.order_date
//                 newlog.product_id = log.product_id
//                 retdata.logs.push(newlog)            
//             })            
//             retdata.rechargedFamilies = rechargeuserids.length

//             retdata.charged = await UserOrder.findAll({
//                 where: { mid: req.mid,product_id:{[op.ne]:0} },
//                 attributes: [[db.Sequelize.fn('sum', db.Sequelize.col('amount')), 'amount']]
//             })
//             retdata.charged = retdata.charged[0].amount
//         }else {
//             logs.map((log,idx) => {
//                 let newlog = {}
//                 newlog.order_id = log.id
//                 newlog.id = log.user_balance_record.id
//                 newlog.amount = log.user_balance_record.amount
//                 newlog.invoice = log.user_balance_record.invoice
//                 newlog.note = log.user_balance_record.note                
//                 newlog.name = log.user_profile.name
//                 newlog.user_id = log.user_id
//                 newlog.order_date = log.order_date
//                 newlog.product_id = log.product_id
//                 retdata.logs.push(newlog)   
//             }) 
//         }
//         return returnResult(res, retdata)
//     })
// }

module.exports.balancesnapshot = {
    get: async (req, res) => {
        let { page, pagesize, countdata, orderfield, order, type, snap_date } = req.query
        type = type ? type : 'privateclass'
        pagesize = Number(pagesize)
        page = Number(page)
        snap_date = new Date(snap_date).toISOString().substring(0, 10)
        doWithTry(res, async () => {
            // let maxDate = await UserBalanceSnapshot.findAll({where:{snap_date:{[op.lte]:snap_date}},attributes: [[db.Sequelize.fn('max', db.Sequelize.col('snap_date')), 'maxDate']]})
            // maxDate = maxDate[0]['maxDate']
            // Debug(maxDate[0]['maxDate'])
            let maxDate = await UserBalanceSnapshot.max('snap_date', { where: { snap_date: { [op.lte]: snap_date } } })
            if (!maxDate) {
                return returnResult(res, { total: 0, members: [], balance: 0, data: [] })
            }
            let where = { mid: req.mid, status: 1 }
            let ret = { total: 0 }
            if (countdata) {
                ret.total = await User.count({ where: where })
            }
            User.hasOne(UserBalanceSnapshot, { foreignKey: 'user_id' })
            //User.hasMany(Member, { foreignKey: 'user_id' })
            User.hasOne(UserProfile, { foreignKey: 'user_id' })
            let orderdesc = [['id', order]]
            if (orderfield == 'parent') {
                orderdesc = [[UserProfile, 'name', order]]
            } else if (orderfield == 'balance') {
                orderdesc = [[UserBalanceSnapshot, 'balance', order]]
            }
            ret.data = await User.findAll({
                attributes: ['id'],
                where: where,
                include: [
                    { model: UserProfile, attributes: ['user_id', 'name', 'phone'] },
                    { model: UserBalanceSnapshot, where: { status: 1, mid: req.mid, type: type, snap_date: maxDate }, attributes: ['balance', 'type', 'member_id', 'update_time', 'snap_date'], required: false },
                    //{ model: Member, attributes: ['id', 'name'], where: { status: 1, mid: req.mid }, required: false },                
                ],
                order: orderdesc,
                limit: pagesize, offset: page * pagesize,
            })
            let ids = []
            ret.data.map((row) => {
                ids.push(row.id)
            })
            ret.members = await Member.findAll({ attributes: ['id', 'user_id', 'name', 'status'], where: { user_id: ids, status: { [op.ne]: 3 } } })
            ret.balance = await UserBalanceSnapshot.sum('balance', {
                where: { mid: req.mid, snap_date: maxDate, status: 1, type: type },
                //attributes: [[db.Sequelize.fn('sum', db.Sequelize.col('balance')), 'balance']]
            })
            ret.snap_date = maxDate
            return returnResult(res, ret)
        })
    }
}
module.exports.snapshotBalance = {
    get: async (req, res) => {
        doWithTry(res, async () => {
            let date = new Date().toISOString().substring(0, 10)
            await db.sequelize.query("delete from user_balance_snapshot where snap_date = '" + date + "'")
            await db.sequelize.query("insert user_balance_snapshot(bid,mid,user_id,member_id,type,balance,status,create_time,update_time,snap_date) select id as bid,mid,user_id,member_id,type,balance,status,create_time,update_time,'" + date + "' as snap_date from user_balance")
            return returnResult(res, "ok")
        })
    }
}
module.exports.snapshotBalanceForService = async () => {
    try {
        let date = new Date().toISOString().substring(0, 10)
        await db.sequelize.query("delete from user_balance_snapshot where snap_date = '" + date + "'")
        await db.sequelize.query("insert user_balance_snapshot(bid,mid,user_id,member_id,type,balance,status,create_time,update_time,snap_date) select id as bid,mid,user_id,member_id,type,balance,status,create_time,update_time,'" + date + "' as snap_date from user_balance")
    } catch (e) {
        ErrorHint(e)
    }
}