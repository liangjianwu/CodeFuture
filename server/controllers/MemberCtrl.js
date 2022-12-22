const { returnResult, returnError, returnSuccess } = require("../components/errcode")
const model = require("../db/model");
const { AppsList } = require("../configs/AppList");
const { loadMenu } = require("../components/MenuUtil");
const { ErrorHint, Debug } = require("../components");
const db = require("../db/db");
const { decryptionString, addressCombine, dateFormat } = require("../components/util");
const { doWithTry, findOne } = require("./utils/Common");
const md5 = require("md5");
const MemberInfoStruct = model.MemberInfoStruct
const Member = model.Member
const UserProfile = model.UserProfile
const MemberInfo = model.MemberInfo
const MerchantGroup = model.Group
const MemberGroup = model.MemberGroup
const User = model.User
const Group = model.Group

module.exports.loginLoad = {
    get: async (req, res) => {
        let content = { serviceMenu: [] }
        let menus = await loadMenu(req.uid, AppsList.crm.appid)
        if (menus) {
            content.serviceMenu = menus
            return returnResult(res, content)
        } else {
            return returnError(res, 910001)
        }
    }
}
module.exports.getMemberInfoStruct = {
    get: async (req, res) => {
        return findOne(res, MemberInfoStruct, { mid: req.mid }, async (mis) => {
            return returnResult(res, mis && mis.struct ? JSON.parse(mis.struct) : [])
        })
    }
}
module.exports.setMemberInfoStruct = async (req, res) => {
    let { form } = req.body
    return findOne(res, MemberInfoStruct, { mid: req.mid }, async (mis) => {
        mis.struct = JSON.stringify(form)
        await mis.save()
        return returnResult(res, mis.id)
    }, () => {
        return doWithTry(res, async () => {
            let mis = await MemberInfoStruct.create({ mid: req.mid, struct: JSON.stringify(form) })
            return returnResult(res, mis.id)
        })
    })
}

module.exports.loadUser = {
    get: async (req, res) => {
        let { page, pagesize, countdata, status, orderfield, order } = req.query
        pagesize = Number(pagesize)
        page = Number(page)
        try {
            let where = { mid: req.mid }
            if (status >= -1) {
                where.status = status
            }
            let ret = { total: 0, data: [] }
            if (countdata) {
                ret.total = await User.count({ where: where })
            }
            User.hasOne(UserProfile, { foreignKey: 'user_id' })
            let datas = await User.findAll({
                where: where,
                include: [{ model: UserProfile, attributes: ['firstname', 'lastname', 'name', 'email', 'phone'] }],
                order: orderfield == 'name' ? [[UserProfile, 'name', order ? order : 'desc']] : [['id', order ? order : 'desc']],
                limit: pagesize,
                offset: page * pagesize,
            })
            let ids = []
            datas.map(data => {
                data.user_profile ? ret.data.push({
                    id: data.id,
                    email: data.email,
                    area_id: data.area_id,
                    firstname: data.user_profile.firstname,
                    lastname: data.user_profile.lastname,
                    name: data.user_profile.name, phone: data.user_profile.phone, create_time: data.create_time,
                    status: data.status,
                    members: []
                }) : ret.data.push({
                    id: data.id,
                    email: data.email,
                    area_id: data.area_id,
                    create_time: data.create_time,
                    status: data.status,
                    members: []
                })
                ids.push(data.id)
            })
            let members = await Member.findAll({ where: { user_id: ids } })
            ret.data.map(data => {
                members.map(member => {
                    if (member.user_id == data.id) {
                        data.members.push(member)
                    }
                })
            })
            return returnResult(res, ret)
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 900001)
        }
    }
}

module.exports.loadCustomer = {
    get: async (req, res) => {
        let { page, pagesize, countdata, status, orderfield, order } = req.query
        pagesize = Number(pagesize)
        page = Number(page)
        orderfield = orderfield ? orderfield : 'id'
        order = order ? order : 'desc'
        try {

            let where = { mid: req.mid }
            if (status >= -1) {
                where.status = status
            }
            let ret = { total: 0 }
            if (countdata) {
                ret.total = await Member.count({ where: where })
            }
            Member.hasMany(MemberInfo, { foreignKey: 'member_id' })
            Member.hasMany(MemberGroup, { foreignKey: 'member_id' })
            Member.belongsTo(UserProfile, { foreignKey: 'user_id', targetKey: 'user_id' })
            ret.data = await Member.findAll({
                where: where,
                include: [{ model: MemberInfo, attributes: ['key', 'value'] },
                { model: MemberGroup, attributes: ['group_id'], where: { status: 1 }, required: false },
                { model: UserProfile, attributes: ['name', 'email', 'phone'] }],
                order: [[orderfield, order]],
                limit: pagesize,
                offset: page * pagesize,
            })
            ret.group = await Group.findAll({
                where: { mid: req.mid, status: 1 },
                attributes: ["id", "name"]
            })
            return returnResult(res, ret)
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 900001)
        }
    }
}
module.exports.editCustomerInfo = async (req, res) => {
    return doWithTry(res, async () => {
        let keys = Object.keys(req.body)
        let k = ['firstname', 'lastname', 'gender', 'birthday', 'phone', 'email', 'user_id', 'area_id']
        let data = {}
        let id = req.body.id
        k.map(kk => {
            req.body[kk] && (data[kk] = req.body[kk])
        })
        if (data.firstname || data.lastname) {
            data.name = data.firstname + ' ' + data.lastname
        }
        if (id == 0) {
            data.mid = req.mid
            let mm = await Member.create(data)
            id = mm.id
            let up = await UserProfile.findOne({ where: { user_id: data.user_id } })
            if (up && data.name) {
                let kids = up.kids ? JSON.parse(up.kids) : []
                kids.push(data.name)
                up.kids = JSON.stringify(kids)
                await up.save()
            }
        } else {
            await Member.update(data, { where: { id: id, mid: req.mid } })
        }
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i]
            if (k.indexOf(key) < 0 && key !== 'id') {
                let kv = await MemberInfo.findOne({ where: { member_id: id, mid: req.mid, key: key } })
                if (kv) {
                    if (req.body[key].length > 255) {
                        kv.extend = req.body[key]
                    } else {
                        kv.value = req.body[key]
                    }
                    await kv.save()
                } else {
                    kv = { member_id: id, mid: req.mid, key: key }
                    if (req.body[key].length > 255) {
                        kv.extend = req.body[key]
                    } else {
                        kv.value = req.body[key]
                    }
                    Debug(kv)
                    await MemberInfo.create(kv)
                }
            }
        }
        return returnResult(res, id)
    })
}
module.exports.getCustomer = {
    get: async (req, res) => {
        return doWithTry(res, async () => {
            let member = req.query.id > 0 ? await Member.findOne({ where: { id: req.query.id } }) : { id: 0 }
            if (member) {
                let info = req.query.id > 0 ? await MemberInfo.findAll({ where: { member_id: member.id } }) : []
                let struct = await MemberInfoStruct.findOne({ where: { mid: req.mid } })
                let mstruct = []
                if (struct) {
                    mstruct = JSON.parse(struct.struct)
                }
                mstruct.unshift({
                    type: "section", label: "Basic information", items: [
                        { type: "input", name: "firstname", label: "First name" },
                        { type: "input", name: "lastname", label: "Last name" },
                        { type: "radio", name: "gender", options: 'Male,Female,Other' },
                        { type: "date", name: "birthday", label: "Birthday" },
                        { type: "input", name: "phone", label: "Phone" },
                        { type: "input", name: "email", label: "Email" },
                    ]
                })
                return returnResult(res, { member: member, info: info, struct: mstruct })
            } else {
                return returnError(res, 300003)
            }
        })
    }
}
module.exports.editUser = async (req, res) => {
    return doWithTry(res, async () => {
        let k = ['firstname', 'lastname', 'phone', 'email', 'area_id']
        let data = {}
        let id = req.body.id
        k.map(kk => {
            req.body[kk] && (data[kk] = req.body[kk])
        })
        if (data.firstname || data.lastname) {
            data.name = data.firstname + ' ' + data.lastname
        }
        if (id > 0) {
            let user = await User.findOne({ where: { id: id, mid: req.mid } })
            if (!user) {
                returnError(res, 100011)
            }
            if (user.email != data.email) {
                let user1 = await User.findOne({ where: { email: data.email } })
                if (user1) {
                    return returnError(res, 100001)
                }
                user.email = data.email
                user.area_id = data.area_id
                await user.save()
            } else {
                user.area_id = data.area_id
                await user.save()
            }
            await UserProfile.update(data, { where: { user_id: id, mid: req.mid } })
            return returnResult(res, id)
        } else {
            let userData = {}
            userData.mid = req.mid
            userData.passwd = md5(md5('123456'))
            userData.email = data.email
            userData.email_verified = 0
            userData.area_id = data.area_id
            let member = await User.create(userData)
            data.user_id = member.id
            data.mid = req.mid
            await UserProfile.create(data)
            return returnResult(res, member.id)
        }
    })
}
const loadGroups = async (req) => {
    let ret = await MerchantGroup.findAll({ attributes: ['id', 'name', 'note',], where: { mid: req.mid }, limit: 500, order: [["id", "desc"]] })
    return ret
}
module.exports.createGroup = async (req, res) => {
    return doWithTry(res, async () => {
        let where = { mid: req.mid, name: req.body.name, status: 1 }
        let mg = await MerchantGroup.findOne({ where: where })
        if (mg) {
            return returnError(res, 300004)
        } else {
            await MerchantGroup.create({ mid: req.mid, name: req.body.name })
        }
        let ret = await loadGroups(req)
        return returnResult(res, ret)
    })
}
module.exports.getGroups = {
    get: async (req, res) => {
        return doWithTry(res, async () => {
            return returnResult(res, await loadGroups(req))
        })
    }
}

module.exports.getGroupCustomers = {
    get: async (req, res) => {
        let { id, page, pagesize, countdata, status } = req.query
        return doWithTry(res, async () => {
            Member.belongsTo(MemberGroup, { foreignKey: "id", targetKey: 'member_id' })
            Member.belongsTo(UserProfile, { foreignKey: 'user_id', targetKey: 'user_id' })
            Member.hasMany(MemberGroup, { foreignKey: 'member_id' })
            let retdata = { total: 0, data: [] }
            let where = { mid: req.mid }
            if (status >= -1) {
                where.status = status
            }
            if (countdata == 1) {
                retdata.total = await Member.count({
                    where: where,
                    include: [{
                        model: MemberGroup,
                        where: { group_id: id, mid: req.mid },
                    }]
                })
            }
            retdata.data = await Member.findAll({
                attributes: ['id', 'name', 'gender', 'birthday', 'create_time', 'status'],
                where: where,
                include: [{
                    model: MemberGroup,
                    attributes: ['member_id'],
                    where: { group_id: id, mid: req.mid, status: 1 },
                },
                { model: MemberGroup, attributes: ['group_id'], where: { status: 1 } },
                {
                    model: UserProfile,
                    attributes: ['name', 'phone', 'email']
                }], order: [['id', 'desc']], limit: 1 * pagesize, offset: page * pagesize
            })
            return returnResult(res, retdata)
        })
    }
}
module.exports.addToGroup = async (req, res) => {
    let { ids, groups } = req.body
    return doWithTry(res, async () => {
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i]
            for (let j = 0; j < groups.length; j++) {
                let group = groups[j]
                await MemberGroup.findOrCreate({
                    where: { member_id: id, mid: req.mid, group_id: group, status: 1 },
                    defaults: { member_id: id, mid: req.mid, group_id: group, status: 1 }
                })
            }
        }
        return returnSuccess(res, 100000)
    })
}
module.exports.searchcustomer = {
    get: async (req, res) => {
        const { value, page, pagesize, countdata, status } = req.query
        const Op = db.Sequelize.Op
        return doWithTry(res, async () => {
            Member.belongsTo(UserProfile, { foreignKey: 'user_id', targetKey: 'user_id' })
            Member.hasMany(MemberGroup, { foreignKey: 'member_id' })
            let retdata = { total: 0, data: [] }
            let where = {
                mid: req.mid,
                [Op.or]: [
                    { name: { [Op.like]: `%${value}%` } },
                ]
            }
            if (status >= -1) {
                where.status = status
            }
            if (countdata == 1) {
                retdata.total = await Member.count({
                    where: where,
                    include: [{
                        model: UserProfile, attributes: ['name'],
                    }],
                })
            }

            retdata.data = await Member.findAll({
                attributes: ['id', 'name', 'gender', 'birthday', 'create_time', 'status'],
                where: where,
                include: [{
                    model: UserProfile, attributes: ['name', 'phone', 'email'],
                }, { model: MemberGroup, attributes: ['group_id'], where: { status: 1 }, required: false }],
                order: [["id", "desc"]],
                limit: pagesize * 1,
                offset: page * pagesize,
            })
            return returnResult(res, retdata)
        })
    }
}
module.exports.searchuser = {
    get: async (req, res) => {
        const { value, page, pagesize, countdata, status } = req.query
        const Op = db.Sequelize.Op
        return doWithTry(res, async () => {
            let retdata = { total: 0, data: [] }
            User.hasOne(UserProfile, { foreignKey: 'user_id' })
            let where = {
                mid: req.mid,
            }
            if (status >= -1) {
                where.status = status
            }
            if (countdata == 1) {
                retdata.total = await User.count({
                    where: where,
                    include: [{
                        model: UserProfile,
                        where: {
                            mid: req.mid,
                            [Op.or]: [
                                { name: { [Op.like]: `%${value}%` } },
                                { email: { [Op.like]: `%${value}%` } },
                                { phone: { [Op.like]: `%${value}%` } },
                            ]
                        }
                    }]
                })
            }

            let datas = await User.findAll({
                attributes: ["id", "email", "create_time", "status"],
                where: where,
                include: [{
                    model: UserProfile,
                    where: {
                        mid: req.mid,
                        [Op.or]: [
                            { name: { [Op.like]: `%${value}%` } },
                            { email: { [Op.like]: `%${value}%` } },
                            { phone: { [Op.like]: `%${value}%` } },
                        ]
                    }
                }],
                order: [["id", "desc"]],
                limit: pagesize * 1,
                offset: page * pagesize,
            })
            let ids = []
            datas.map(data => {
                data.user_profile ? retdata.data.push({
                    id: data.id,
                    email: data.email,
                    firstname: data.user_profile.firstname,
                    lastname: data.user_profile.lastname,
                    name: data.user_profile.name, phone: data.user_profile.phone, create_time: data.create_time,
                    status: data.status,
                    members: []
                }) : retdata.data.push({
                    id: data.id,
                    email: data.email,
                    create_time: data.create_time,
                    status: data.status,
                    members: []
                })
                ids.push(data.id)
            })
            let members = await Member.findAll({ where: { user_id: ids } })
            retdata.data.map(data => {
                members.map(member => {
                    if (member.user_id == data.id) {
                        data.members.push(member)
                    }
                })
            })
            return returnResult(res, retdata)
        })
    }
}
module.exports.removeFromGroup = async (req, res) => {
    doWithTry(res, async () => {
        let where = { id: req.body.groupid, mid: req.mid, status: 1 }
        let mg = await MerchantGroup.findOne({ where: where })
        if (!mg) {
            return returnError(res, 300007)
        }
        let num = await MemberGroup.update({ status: 0 }, { where: { group_id: mg.id, member_id: req.body.ids, status: 1 } })
        return returnResult(res, num)
    })


}
module.exports.changeMemberStatus = async (req, res) => {
    const { id, status } = req.body
    return doWithTry(res, async () => {
        await Member.update({ status: status }, { where: { id: id, mid: req.mid } })
        return returnResult(res, status)
    })
}
module.exports.changeUserStatus = async (req, res) => {
    const { id, status } = req.body
    return doWithTry(res, async () => {
        await User.update({ status: status }, { where: { id: id, mid: req.mid } })
        return returnResult(res, status)
    })
}
module.exports.changeMemberLevel = async (req, res) => {
    const { id, level } = req.body
    return doWithTry(res, async () => {
        await Member.update({ level: level }, { where: { id: id, mid: req.mid } })
        return returnResult(res, level)
    })
}