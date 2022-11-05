const model = require("../../db/model");
const md5 = require("md5");
const { Util, errorMsg, Debug, ErrorHint, Log, Hint } = require('../../components');
const appConfig = require('../../configs/app.config');
const { returnSuccess, returnError, returnResult } = require("../../components/errcode");
const { doWithTry } = require("../../controllers/utils/Common");

const User = model.User;
const UserAuth = model.UserAuth
const UserVerify = model.UserVerify
const UserProfile = model.UserProfile
const MerchantAuth = model.MerchantAuth

module.exports.register = async (req, res) => {
    return doWithTry(res,async ()=>{
        req.body.passwd = md5(req.body.passwd)        
        
        let condition = {
            attributes: ['id'],
            where: { email: req.body.email,mid:req.mid}
        }
        let user = await User.findOne(condition)
        if (user) {
            return returnError(res,100001)
        }    
        req.body.mid = req.mid
        req.body.status = 0
        user = await User.create(req.body)
        let auth = {
            token: md5(req.requestUa + req.body.phone + req.body.email + req.body.passwd + Date.now()),
            expired_time: Date.now() + appConfig.auth_token_expired_time,
            device: req.requestDevice,
            user_id: user.id,
            mid:req.mid,
            status:1,
            ip: req.requestIp,
        }
        await UserProfile.create({
            user_id:user.id,
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            name:req.body.firstname + ' ' + req.body.lastname,
            mid:req.mid,
            email:req.body.email,
            phone:req.body.phone
        })
        await UserAuth.create(auth)
        //await UserVerify.create({ mid:req.mid,user_id: user.id, item: req.body.email, type: 'email',action:'register', code: Util.generateNumberCode(6), expired_time: Date.now() + 600000, send_status: 0, verify_status: 0 })
        return returnResult(res,{ userid: user.id, email:user.email,token: auth.token ,email_verified: 0,expired_time:auth.expired_time})        
    })
};

module.exports.sendcode = async (req, res) => {
    User.findOne({ where: {id:req.uid} }).then(user => {
        if (user) {
            let data = { mid:req.mid,user_id: user.id, item:user.email, type: 'email', action:req.body.action,code: Util.generateNumberCode(6), expired_time: Date.now() + 600000, send_status: 0, verify_status: 0 }
            UserVerify.update(data, { where: { user_id: user.id, item: user.email, type: 'email',action:req.body.action } }).then(num => {                
                if (num == 1) {
                    return returnSuccess(res,100001,"")
                } else {
                    UserVerify.create(data).then(uv => {
                        return returnSuccess(res,100001,"")
                    }).catch(err => {
                        ErrorHint("debug: " + err)
                        return returnError(res,192001)
                    })
                }
            }).catch(err => {
                ErrorHint("debug: " + err)
                return returnError(res,192002)
            })
        } else {
            return returnError(res,100011)
        }
    }).catch(error => {
        ErrorHint(error.message)
        return returnError(res,191003)
    })

};
//no signin ,use email to search the user
module.exports.sendcode1 = async (req, res) => {
    User.findOne({ where: {email:req.body.email,mid:req.mid} }).then(user => {
        if (user) {
            let data = { mid:req.mid,user_id: user.id, item:user.email, type: 'email', action:req.body.action,code: Util.generateNumberCode(6), expired_time: Date.now() + 600000, send_status: 0, verify_status: 0 }
            UserVerify.update(data, { where: { user_id: user.id, item: user.email, type: 'email',action:req.body.action } }).then(num => {                
                if (num == 1) {
                    return returnSuccess(res,100001,"")
                } else {
                    UserVerify.create(data).then(uv => {
                        return returnSuccess(res,100001,"")
                    }).catch(err => {
                        ErrorHint("debug: " + err)
                        return returnError(res,192001)
                    })
                }
            }).catch(err => {
                ErrorHint("debug: " + err)
                return returnError(res,192002)
            })
        } else {
            return returnError(res,100011)
        }
    }).catch(error => {
        ErrorHint(error.message)
        return returnError(res,191003)
    })

};
module.exports.verifycode = async (req, res) => {
    let code = req.body.code
    let action = req.body.action
    let type = 'email'
    let where = { user_id: req.uid, code: code, type: type,action:action }    
    UserVerify.findOne({ where: where }).then(uv => {
        if (uv) {
            if (uv.verify_status != 0) {
                return returnError(res,100023)
            }
            if (uv.expired_time < Date.now()) {
                return returnError(res,100022)
            }
            UserVerify.update({ verify_status: 1 }, { where: { id: uv.id } })
            User.update({ email_verified: 1 }, { where: { id: uv.user_id } }).then(num => {
                if (num == 1) {
                    return returnSuccess(res,100002)
                } else {
                    return returnError(res,190022)
                }
            }).catch(err => {
                ErrorHint(err)
                return returnError(res,190021)
            })
        } else {
            return returnError(res,100021)
        }
    }).catch(error => {
        ErrorHint("Error:" + error.message)
        return returnError(res,190024)
    })
};


module.exports.resetpwd = async (req, res) => {
    let email = req.body.email
    let code = req.body.code
    let newpwd = md5(req.body.passwd)    
    User.findOne({ where: {email:email,mid:req.mid}}).then(user => {
        if (user) {
            UserVerify.findOne({ where: { mid:req.mid,item:email,type: 'email', action: 'resetpwd', code: code } }).then(uv => {
                if (uv) {
                    if (uv.verify_status != 0) {
                        return returnError(res,100033)
                    }
                    if (uv.expired_time < Date.now()) {
                        return returnError(res,100032)
                    }
                    UserVerify.update({ verify_status: 1 }, { where: { id: uv.id } })
                    User.update({ email_verified: 1, passwd: newpwd }, { where: { id: user.id } }).then(num => {
                        return returnSuccess(res,100003)
                    }).catch(err => {
                        ErrorHint("debug: " + err)
                        return returnError(res,190031)
                    })
                } else {
                    return returnError(res,190033)
                }
            }).catch(err => {
                ErrorHint("debug: " + err)
                return returnError(res,190034)
            })
        } else {
            return res.status(209).json({
                success: false,
                data: errorMsg(900004)
            })
        }
    }).catch(error => {
        ErrorHint("Error:" + error.message)
        return returnError(res,190035)
    })
}

module.exports.login = (req, res) => {
    let account = req.body.email
    let pwd = md5(req.body.passwd)    
    let where = { email: account,mid:req.mid, passwd:pwd }    
    User.findOne({ where: where }).then(user => {
        if (user) {
            let data = {}
            data.token = md5(req.requestUa + user.email + user.passwd + Date.now())
            data.expired_time = Date.now() + appConfig.auth_token_expired_time
            data.device = req.requestDevice
            data.user_id = user.id
            data.mid = req.mid
            data.ip = req.requestIp
            data.status = 1
            if (user.email_verified == 0) {
                UserVerify.update(
                    { code: Util.generateNumberCode(6),item:user.email, expired_time: Date.now() + 600000, send_status: 0, verify_status: 0 },
                    { where: { user_id: user.id, action: 'email', action: 'register' } }
                )
            }
            UserAuth.update(data, { where: { user_id: user.id } }).then(num => {
                if (num == 1) {
                    return returnResult(res,{ userid: user.id,email:user.email,email_verified: user.email_verified, token: data.token ,expired_time:data.expired_time})
                } else {
                    UserAuth.create(data).then(userauth => {
                        return returnResult(res,{ userid: user.id, email_verified: user.email_verified, token: data.token,expired_time:data.expired_time})
                    }).catch(err => {
                        ErrorHint("debug: " + err)
                        return returnError(res,190041)
                    })
                }
            }).catch(err => {
                ErrorHint("debug: " + err)
                return returnError(res,190042)
            })
        } else {
            return returnError(res,100041)
        }
    }).catch(error => {
        ErrorHint("Error:" + error.message)
        return returnError(res,190043)
    })
}
module.exports.logout = async (req,res)=>{
    UserAuth.findOne({where:{user_id:req.uid}}).then(ua=>{
        if(ua) {
            ua.expired_time = 0
            ua.update()
            return returnSuccess(res,100000)
        }else {
            return returnSuccess(res,100000)
        }
    }).catch(e=>{
        return returnError(res,100051)
    })
}
module.exports.getprofile = async(req,res)=>{
    User.findOne({where:{id:req.uid}}).then(user=>{
        if(user) {
            UserProfile.findOne({where:{user_id:req.uid}}).then(ua=>{
                if(ua) {
                    return returnResult(res,ua)
                }else {
                    UserProfile.create({user_id:user.id})
                    return returnResult(res,{user_id:user.id})
                }
            }).catch(e=>{
                ErrorHint(e)
                return returnError(res,190062)
            })
        }else {
            return returnError(res,100062)
        }
    }).catch(e=>{
        ErrorHint(e)
        return returnError(res,190061)
    })
}
module.exports.setprofile = async(req,res)=>{
    User.findOne({where:{id:req.uid}}).then(user=>{
        if(user) {
            UserProfile.findOne({where:{user_id:req.uid}}).then(ua=>{
                if(ua) {                    
                    ua.update(req.body).then(num=>{
                        return returnSuccess(res,100061)
                    }).catch(e=>{
                        ErrorHint(e)
                        return returnError(res,100063)
                    })
                }else {
                    req.body.user_id = user.id
                    UserProfile.create(req.body).then(up1=>{
                        return returnSuccess(res,100061)
                    }).catch(e=>{
                        ErrorHint(e)
                        return returnError(res,100063)
                    })
                }
            }).catch(e=>{
                ErrorHint(e)
                return returnError(res,190062)
            })
        }else {
            return returnError(res,100062)
        }
    }).catch(e=>{
        ErrorHint(e)
        return returnError(res,190061)
    })
}