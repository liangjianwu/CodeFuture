const { returnResult, returnError, returnSuccess } = require("../components/errcode")
const model = require("../db/model");
const { Sequelize } = require("../db/db");
const { ErrorHint, Debug } = require("../components");
const { loadMenu } = require("../components/MenuUtil");
const { clearCache } = require("../components/cache");
const { AppsList } = require("../configs/AppList");
const { checkUser, findOne, doWithTry } = require("./utils/Common");
const md5 = require("md5");
const { SaasMenu, SaasFirstMenu } = require("../configs/SaaSMenu");


const MerchantProfile = model.MerchantProfile
const User = model.MUser
const UserAuth = model.MUserAuth
const UserProfile = model.MUserProfile
const MerchantAuth = model.MerchantAuth
const UserVerify = model.UserVerify
const UserRole = model.MUserRole
const RoleAuth = model.RoleAuth
const Role = model.Role
const Menu = model.MenuTable

// module.exports.loginLoad = {
//     get: async (req, res) => {
//         let content = { serviceMenu: [] }
//         let menus = req.mid > 0 ? SaasMenu() : SaasFirstMenu()
//         if (menus) {
//             content.serviceMenu = menus
//             if (req.mid > 0) {
//                 return findOne(res, MerchantProfile, { id: req.mid }, (ma) => {
//                     content.merchant = { name: ma.name, id: ma.id }
//                     return returnResult(res, content)
//                 })
//             } else {
//                 return returnResult(res, content)
//             }
//             //return returnResult(res, content)
//         } else {
//             return returnError(res, 910001)
//         }
//     }
// }

const mySaasMenu = async (req)=>{
    let mr = await  UserRole.findAll({where:{mid:req.mid,user_id:req.uid,status:1}})
    if(mr.length == 0) return []
    let roles = []
    for(let ur of mr) {
        roles.indexOf(ur.role_id) == -1 && roles.push(ur.role_id)
    }
    let ra = await RoleAuth.findAll({where:{mid:req.mid,role_id:roles,status:1}})
    if(ra.length == 0) return []
    let menu_ids = []
    for(let m of ra) {
        menu_ids.indexOf(m.menu_id) == -1 && menu_ids.push(m.menu_id)
    }
    let menus  = await Menu.findAll({where:{mid:[0,req.mid],id:menu_ids,status:1,type:0},order:[["parent_id",'ASC'],['position','desc']]})
    return menus;
}
module.exports.loginLoad = {
    get: async (req, res) => {
        doWithTry(res,async()=>{
            let content = { serviceMenu: [] }
            let menus = req.mid > 0 ? await mySaasMenu(req) : SaasFirstMenu()
            if (menus) {
                content.serviceMenu = menus
                if (req.mid > 0) {
                    return findOne(res, MerchantProfile, { id: req.mid }, (ma) => {
                        content.merchant = { name: ma.name, id: ma.id }
                        return returnResult(res, content)
                    })
                } else {
                    return returnResult(res, content)
                }
                //return returnResult(res, content)
            } else {
                return returnError(res, 910001)
            }
        })
    }
}
module.exports.merchant = {
    get: async (req, res) => {
        let content = {}
        let mu = await User.findOne({ where: { id: req.uid, status: 1 } })
        if (mu) {
            content.merchant = await MerchantProfile.findOne({ attributes: ["id", "name", "industry"], where: { id: mu.mid, status: 1 } })
        }
        return returnResult(res, content)
    }
}
module.exports.merchantpwd = {
    get: async (req, res) => {
        doWithTry(res, async () => {
            let ma = await MerchantAuth.findOne({ attributes: ["id", "token"], where: { mid: req.mid } })
            if (!ma) {
                return returnError(res, 200004)
            }
            let t = ma.token.substring(ma.token.length - 6)
            //await ma.update({token:md5(ma.token)})
            return returnResult(res, t)
        })
    }
}
module.exports.addcompany = async (req, res) => {
    return checkUser(req, res, async (mu, req, res) => {
        if (mu.mid > 0) {
            return findOne(res, MerchantProfile, { id: mu.mid }, async (mp) => {
                await mp.update(req.body)
                return returnSuccess(res, '')
            })
        } else {
            let ma = await MerchantAuth.findOne({ where: { domain: req.get('host') } })
            if (ma) {
                return returnError(res, 200006)
            }
            return findOne(res, UserProfile, { user_id: req.uid }, async (up) => {
                let mpdata = req.body
                mpdata.user_id = req.uid
                up && up.lastname && up.firstname && (mpdata.contact_person = up.firstname + ' ' + up.lastname)
                up && up.email && (mpdata.contact_email = up.email)
                let mp = await MerchantProfile.create(mpdata);
                mp.mid = mp.id
                await mp.save()
                mu.mid = mp.id
                await mu.save()
                let mpa = await MerchantAuth.create({ mid: mp.id, domain: req.get('host'), token: md5(mp.id + mp.name + Date.now()) })
                await UserAuth.update({ mid: mp.id }, { where: { user_id: mu.id } })
                let role = await Role.create({mid:mp.id,name:'Admin',note:'Create By System',status:1})
                if(role) {
                    let ur = await UserRole.create({mid:mp.id,user_id:req.uid,role_id:role.id,status:1})
                    let menus = await Menu.findAll({where:{mid:0,status:1}})
                    for(let m of menus) {
                        await RoleAuth.create({mid:mp.id,role_id:role.id,menu_id:m.id,status:1})
                    }
                }
                clearCache()
                return returnResult(res, { id: mp.id, token: mpa.token.substring(mpa.token.length - 6) })
            })
        }
    })
}

module.exports.joincompany = async (req, res) => {
    return checkUser(req, res, async (mu, req, res) => {
        if (mu.mid > 0) {
            return returnError(res, 200001)
        } else {
            let ma = await MerchantAuth.findOne({ where: { domain: req.get('host') } })
            if (!ma || ma.token.substring(ma.token.length - 6) != req.body.token) {
                return returnError(res, 200002)
            }
            mu.mid = ma.mid
            await mu.save()
            await UserAuth.update({ mid: ma.mid }, { where: { user_id: mu.id } })
            await UserProfile.update({ mid: ma.mid }, { where: { user_id: mu.id } })
            await UserVerify.update({ mid: ma.mid }, { where: { user_id: mu.id } })
            await ma.update({ token: md5(ma.token) })
            clearCache()
            return returnResult(res, 'success')
        }
    })
}