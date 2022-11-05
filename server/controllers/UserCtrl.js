const model = require("../db/model");
const md5 = require("md5");
const { Util, errorMsg, Debug, ErrorHint, Log, Hint } = require('../components');
const appConfig = require('../configs/app.config');
const { returnSuccess, returnError, returnResult } = require("../components/errcode");
const { doWithTry } = require("./utils/Common");

const User = model.MUser;
const UserAuth = model.MUserAuth
const UserVerify = model.MUserVerify
const UserProfile = model.MUserProfile
const Coach = model.Coach

module.exports.register = async (req, res) => {
    //@methed:post
    //@validate:register 
    req.body.passwd = md5(req.body.passwd)
    let condition = {
        attributes: ['id'],
        where: { email: req.body.email }
    }

    let user = await User.findOne(condition)
    if (user) {
        return returnError(res, 100001)
    }
    User.create(req.body).then(user => {
        let auth = {
            token: md5(req.requestUa + req.body.phone + req.body.email + req.body.passwd + Date.now()),
            expired_time: Date.now() + appConfig.auth_token_expired_time,
            device: req.requestDevice,
            user_id: user.id,
            ip: req.requestIp,
        }
        UserProfile.create({ user_id: user.id, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email })
        UserAuth.create(auth).then(userauth => {
            //UserVerify.create({ user_id: user.id, item: req.body.email, type: 'email',action:'register', code: Util.generateNumberCode(6), expired_time: Date.now() + 600000, send_status: 0, verify_status: 0 })
            return returnResult(res, { userid: user.id, email: user.email, token: auth.token, email_verified: 0, expired_time: auth.expired_time })
        }).catch(err => {
            ErrorHint(err);
            return returnError(res, 190001)
        })
    }).catch(err => {
        ErrorHint(err);
        return returnError(res, 190002)
    })
};

module.exports.sendcode = async (req, res) => {
    User.findOne({ where: { id: req.uid, status: 1 } }).then(user => {
        if (user) {
            let data = { user_id: user.id, item: user.email, type: 'email', action: req.body.action, code: Util.generateNumberCode(6), expired_time: Date.now() + 600000, send_status: 0, verify_status: 0 }
            UserVerify.update(data, { where: { user_id: user.id, item: user.email, type: 'email', action: req.body.action } }).then(num => {
                if (num == 1) {
                    return returnSuccess(res, 100001, data.code)
                } else {
                    UserVerify.create(data).then(uv => {
                        return returnSuccess(res, 100001, data.code)
                    }).catch(err => {
                        ErrorHint("debug: " + err)
                        return returnError(res, 192001)
                    })
                }
            }).catch(err => {
                ErrorHint("debug: " + err)
                return returnError(res, 192002)
            })
        } else {
            return returnError(res, 100011)
        }
    }).catch(error => {
        ErrorHint(error.message)
        return returnError(res, 191003)
    })

};
//no signin ,use email to search the user
module.exports.sendcode1 = async (req, res) => {
    User.findOne({ where: { email: req.body.email, status: 1 } }).then(user => {
        if (user) {
            let data = { user_id: user.id, item: user.email, type: 'email', action: req.body.action, code: Util.generateNumberCode(6), expired_time: Date.now() + 600000, send_status: 0, verify_status: 0 }
            UserVerify.update(data, { where: { user_id: user.id, item: user.email, type: 'email', action: req.body.action } }).then(num => {
                if (num == 1) {
                    return returnSuccess(res, 100001, data.code)
                } else {
                    UserVerify.create(data).then(uv => {
                        return returnSuccess(res, 100001, data.code)
                    }).catch(err => {
                        ErrorHint("debug: " + err)
                        return returnError(res, 192001)
                    })
                }
            }).catch(err => {
                ErrorHint("debug: " + err)
                return returnError(res, 192002)
            })
        } else {
            return returnError(res, 100011)
        }
    }).catch(error => {
        ErrorHint(error.message)
        return returnError(res, 191003)
    })

};
module.exports.verifycode = async (req, res) => {
    let code = req.body.code
    let action = req.body.action
    let type = 'email'
    let where = { user_id: req.uid, code: code, type: type, action: action }
    UserVerify.findOne({ where: where }).then(uv => {
        if (uv) {
            if (uv.verify_status != 0) {
                return returnError(res, 100023)
            }
            if (uv.expired_time < Date.now()) {
                return returnError(res, 100022)
            }
            UserVerify.update({ verify_status: 1 }, { where: { id: uv.id } })
            User.update({ email_verified: 1 }, { where: { id: uv.user_id } }).then(num => {
                if (num == 1) {
                    return returnSuccess(res, 100002)
                } else {
                    return returnError(res, 190022)
                }
            }).catch(err => {
                ErrorHint(err)
                return returnError(res, 190021)
            })
        } else {
            return returnError(res, 100021)
        }
    }).catch(error => {
        ErrorHint("Error:" + error.message)
        return returnError(res, 190024)
    })
};


module.exports.resetpwd = async (req, res) => {
    let email = req.body.email
    let code = req.body.code
    let newpwd = md5(req.body.passwd)
    User.findOne({ where: { email: email } }).then(user => {
        if (user) {
            UserVerify.findOne({ where: { item: email, type: 'email', action: 'resetpwd', code: code } }).then(uv => {
                if (uv) {
                    if (uv.verify_status != 0) {
                        return returnError(res, 100033)
                    }
                    if (uv.expired_time < Date.now()) {
                        return returnError(res, 100032)
                    }
                    UserVerify.update({ verify_status: 1 }, { where: { id: uv.id } })
                    User.update({ email_verified: 1, passwd: newpwd }, { where: { id: user.id } }).then(num => {
                        if (num == 1) {
                            return returnSuccess(res, 100003)
                        } else {
                            return returnError(res, 190032)
                        }
                    }).catch(err => {
                        ErrorHint("debug: " + err)
                        return returnError(res, 190031)
                    })
                } else {
                    return returnError(res, 190033)
                }
            }).catch(err => {
                ErrorHint("debug: " + err)
                return returnError(res, 190034)
            })
        } else {
            return res.status(209).json({
                success: false,
                data: errorMsg(900004)
            })
        }
    }).catch(error => {
        ErrorHint("Error:" + error.message)
        return returnError(res, 190035)
    })
}
module.exports.coachlogin = (req, res) => {
    let account = req.body.email
    let pwd = md5(req.body.passwd)
    let where = { email: account, status: 1, passwd: pwd }
    doWithTry(res, async () => {
        let coach = await Coach.findOne({ where: where })
        if (coach) {
            let token = md5(req.requestUa + coach.email + coach.passwd + Date.now())
            coach.token = token
            coach.ip = req.requestIp
            coach.device = req.requestDevice
            coach.expired_time = Date.now() + appConfig.auth_token_expired_time
            await coach.save()
            return returnResult(res, { userid: coach.id, token: token, expired_time: coach.expired_time })
        } else {
            return returnError(res, '100041')
        }
    })
}
module.exports.login = (req, res) => {
    let account = req.body.email
    let pwd = md5(req.body.passwd)
    let where = { email: account, status: 1, passwd: pwd }
    User.findOne({ where: where }).then(user => {
        if (user) {
            let data = {}
            data.mid = user.mid
            data.token = md5(req.requestUa + user.email + user.passwd + Date.now())
            data.expired_time = Date.now() + appConfig.auth_token_expired_time
            data.device = req.requestDevice
            data.user_id = user.id
            data.ip = req.requestIp
            data.status = 1
            if (user.email_verified == 0) {
                UserVerify.update(
                    { mid: user.mid, code: Util.generateNumberCode(6), item: user.email, expired_time: Date.now() + 600000, send_status: 0, verify_status: 0 },
                    { where: { user_id: user.id, action: 'email', action: 'register' } }
                )
            }
            UserAuth.update(data, { where: { user_id: user.id } }).then(num => {
                if (num == 1) {
                    return returnResult(res, { userid: user.id, email: user.email, email_verified: user.email_verified, token: data.token, expired_time: data.expired_time })
                } else {
                    UserAuth.create(data).then(userauth => {
                        return returnResult(res, { userid: user.id, email_verified: user.email_verified, token: data.token, expired_time: data.expired_time })
                    }).catch(err => {
                        ErrorHint("debug: " + err)
                        return returnError(res, 190041)
                    })
                }
            }).catch(err => {
                ErrorHint("debug: " + err)
                return returnError(res, 190042)
            })
        } else {
            return returnError(res, 100041)
        }
    }).catch(error => {
        ErrorHint("Error:" + error.message)
        return returnError(res, 190043)
    })
}
module.exports.logout = {
    get: async (req, res) => {
        UserAuth.findOne({ where: { user_id: req.uid } }).then(ua => {
            if (ua) {
                ua.expired_time = 0
                ua.update()
                return returnSuccess(res, 100000)
            } else {
                return returnSuccess(res, 100000)
            }
        }).catch(e => {
            return returnError(res, 100051)
        })
    }
}
module.exports.getprofile = {
    get: async (req, res) => {
        User.findOne({ where: { id: req.uid, status: 1 } }).then(user => {
            if (user) {
                UserProfile.findOne({ where: { user_id: req.uid } }).then(ua => {
                    if (ua) {
                        return returnResult(res, ua)
                    } else {
                        UserProfile.create({ user_id: user.id })
                        return returnResult(res, { user_id: user.id })
                    }
                }).catch(e => {
                    ErrorHint(e)
                    return returnError(res, 190062)
                })
            } else {
                return returnError(res, 100062)
            }
        }).catch(e => {
            ErrorHint(e)
            return returnError(res, 190061)
        })
    }
}
module.exports.setprofile = async (req, res) => {
    User.findOne({ where: { id: req.uid, status: 1 } }).then(user => {
        if (user) {
            req.body.mid = user.mid
            UserProfile.findOne({ where: { user_id: req.uid } }).then(ua => {
                if (ua) {
                    ua.update(req.body).then(num => {
                        return returnSuccess(res, 100061)
                    }).catch(e => {
                        ErrorHint(e)
                        return returnError(res, 100063)
                    })
                } else {
                    req.body.user_id = user.id
                    UserProfile.create(req.body).then(up1 => {
                        return returnSuccess(res, 100061)
                    }).catch(e => {
                        ErrorHint(e)
                        return returnError(res, 100063)
                    })
                }
            }).catch(e => {
                ErrorHint(e)
                return returnError(res, 190062)
            })
        } else {
            return returnError(res, 100062)
        }
    }).catch(e => {
        ErrorHint(e)
        return returnError(res, 190061)
    })
}