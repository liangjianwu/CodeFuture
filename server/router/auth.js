const model = require("../db/model")
const db = require('../db/db')
const md5 = require('md5')
const { Hint, Debug, ErrorHint } = require('../components');
const { errorMsg, returnError } = require("../components/errcode");
const appConfig = require("../configs/app.config");
const { recordSysLog, doWithTry } = require("../controllers/utils/Common");

const UserAuth = model.MUserAuth;
const Coach = model.Coach;
const Menu = model.MenuTable;
const UserRole = model.MUserRole;
const RoleAuth = model.RoleAuth;

const passPath = {
    user: {
        register: ['POST'],
        login: ['POST'],
        coachlogin: ['POST'],
        verifycode: ['GET', 'POST'],
        sendcode:['POST'],
        resetpwd: ['POST'],
        sendcode1:['POST'],
    },
    auth: {
        login:['GET','POST'],
        register:['GET','POST'],
    },
    resource:{
        photo:['GET'],
    }
}
const coachPath = {
    coach: {
        loadschedule:['GET'],
    }
}
const defaultPath = [
    '/service/loginload',
    '/user/sendcode',
    '/service/merchant',
    '/user/profile',
    '/service/joincompany',
    '/service/addcompany',
]
const checkAuth = async (req,res,callback) =>{
    doWithTry(res,async()=>{
        let path = req.path        
        if(defaultPath.indexOf(path)>=0) {
            return callback(req,res)
        }
        let method = req.method
        let idx = ['POST','GET','DELETE','PUT'].indexOf(method)

        let menus = await Menu.findAll({where:{mid:[0,req.mid],url:path,status:1}})
        if(menus.length == 0) {
            return returnError(res,900009) 
        }else {
            for(let menu of menus) {
                if(idx >=0 && menu.method.substring(idx,idx+1) == 1) {
                    let roles = await RoleAuth.findAll({where:{mid:req.mid,menu_id:menu.id,status:1}})
                    let roleids = []
                    for(let r of roles) {
                        roleids.indexOf(r.role_id) == -1 && roleids.push(r.role_id)
                    }
                    let ur = await UserRole.findAll({where:{mid:req.mid,user_id:req.uid,role_id:roleids,status:1}})
                    if(ur.length>0) {
                        Debug("Check auth pass")
                        return callback(req,res)
                    }
                    break
                }
            }
        }
        Debug("Check auth failed")
        return returnError(res,900008) 
    })
}
const auth = async (req, res, callback) => {
    UserAuth.findOne({where:{user_id:req.uid}}).then(ua=>{
        if(ua) {
            req.mid = ua.mid
            if(ua.ip !== req.requestIp || ua.device !== req.requestDevice) {
                return returnError(res,900004)
            }else if(ua.expired_time < Date.now()) {                
                return returnError(res,900003)
            }else if(md5(ua.token+req.time) !== req.token) {                
                return returnError(res,900002)
            }
            ua.update({expired_time:Date.now()+appConfig.auth_token_expired_time})
            return checkAuth(req,res,callback)
        }else {
            return returnError(res,900004)
        }
    }).catch(e=>{
        ErrorHint(e)
        return returnError(res,900005)
    })
}
const coachAuth = async (req, res, callback) => {
    Coach.findOne({where:{id:req.coachid}}).then(ua=>{
        if(ua) {
            req.mid = ua.mid
            if(ua.ip !== req.requestIp || ua.device !== req.requestDevice) {
                return returnError(res,900004)
            }else if(ua.expired_time < Date.now()) {                
                return returnError(res,900003)
            }else if(md5(ua.token+req.time) !== req.token) {                
                return returnError(res,900002)
            }
            ua.update({expired_time:Date.now()+appConfig.auth_token_expired_time})
            return callback(req,res)            
        }else {
            return returnError(res,900004)
        }
    }).catch(e=>{
        ErrorHint(e)
        return returnError(res,900005)
    })
}
const authRouter = async (req, res, next) => {
    let paths = req.path.split('/')
    if (paths.length < 3) {
        return returnError(res,900000)
    }    
    req.req_action = paths[paths.length - 1];
    req.req_component = paths[paths.length - 2];
    req.requestUa = req.get('User-Agent')
    req.requestIp = req.headers['X-Real_IP'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    req.requestDevice = md5(req.reuestUa + req.requesetIp)    

    let appid = req.headers['request-appid'];        
    req.uid = req.headers['request-userid'];
    req.coachid = req.headers['request-coachid'];
    req.token = req.headers['request-token'];
    req.time = req.headers['request-time'];
    req.appid = appid?appid:0;
    Debug(req.path)
    if(req.coachid > 0 && !req.uid) {
        if (coachPath[req.req_component] && coachPath[req.req_component][req.req_action] && coachPath[req.req_component][req.req_action].includes(req.method)) {                                  
            coachAuth(req, res, (req, res) => {
                next()
            })
        }else {
            return returnError(res,900004)
        }
    } else {
        if (passPath[req.req_component] && passPath[req.req_component][req.req_action] && passPath[req.req_component][req.req_action].includes(req.method)) {            
            Debug("Pass")
            next()
        } else {       
            Debug("Auth")     
            recordSysLog(res,req,req.method,req.path,['GET','DELETE'].indexOf(req.method)>=0 ?JSON.stringify(req.query):JSON.stringify(req.body),1)
            auth(req, res, (req, res) => {                
                next()
            })
        }
    }
}

module.exports = { authRouter, auth }

