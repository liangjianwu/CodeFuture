const model = require("../db/model")
const md5 = require('md5')
const { Hint, Debug, ErrorHint } = require('../components');
const { errorMsg, returnError } = require("../components/errcode");
const appConfig = require("../configs/app.config");

const UserAuth = model.UserAuth;
const MerchantAuth = model.MerchantAuth
const passPath = {
    user: {
        register: ['POST'],
        login: ['POST'],
        verifycode: ['GET', 'POST'],
        resetpwd: ['POST'],
        sendcode1:['POST'],
    },
    event:{
        getevent:['GET'],
        loadevents:['GET'],
        applyevent:['POST'],
        photo:['GET'],
        setuppay:['POST'],
        paycallback:['GET'],
        loadapplicants:['GET'],
    },
    home:{
        loadresources:['GET'],
        photo:['GET'],
    }
}
const checkAuth = async (req) => {
    if(!req.uid) return 900002
    try {
        let ua = await UserAuth.findOne({where:{user_id:req.uid}})
        if(ua) {
            if(ua.ip !== req.requestIp || ua.device !== req.requestDevice) {
                return 900004
            }else if(ua.expired_time < Date.now()) {                
                return 900003
            }else if(md5(ua.token+req.time) !== req.token) {                
                return 900002
            }
            await ua.update({expired_time:Date.now()+appConfig.auth_token_expired_time})
            return 0
        }else {
            return 900004
        }
    }catch(e) {
        ErrorHint(e)
        return 900005
    }
}

const auth = async (req, res, callback) => {
    if(!req.uid) return returnError(res,900004)    
    UserAuth.findOne({where:{user_id:req.uid}}).then(ua=>{
        if(ua) {
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
    req.token = req.headers['request-token'];
    req.time = req.headers['request-time'];
    req.appid = appid?appid:0;

    let ma = await MerchantAuth.findOne({where:{domain:req.get('host')}})    
    if(ma) {
        req.mid = ma.mid
    }else {
        req.mid = 0
    }
    if (passPath[req.req_component] && passPath[req.req_component][req.req_action] && passPath[req.req_component][req.req_action].includes(req.method)) {        
        next()
    } else {        
        auth(req, res, (req, res) => {
            next()
        })
    }
}

module.exports = { authRouter, auth ,checkAuth}

