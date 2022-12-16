const { returnResult, returnError, returnSuccess } = require("../../components/errcode")
const { ErrorHint, Debug } = require("../../components");
const model = require('../../db/model');
const User = model.MUser
const UserAction = model.UserAction

module.exports.checkUser = async (req,res,callback)=>{
    try {
        let mu = await User.findOne({ where: { id: req.uid, status: 1 } })
        if (mu) {
            return await callback(mu,req,res)
        } else {
            return returnError(res, 300001)
        }
    }catch(e){
        ErrorHint(e)
        return returnError(res, 900001)
    }
}

module.exports.findOne = async (res,modelObj,where,callback,nodata)=>{
    try {
        let mu = await modelObj.findOne({ where: where })
        if (mu) {
            return await callback(mu)
        } else {
            return nodata?nodata():returnError(res, 910006)
        }
    }catch(e){
        ErrorHint(e)
        return returnError(res, 900001)
    }
}

module.exports.doWithTry = async (res,callback)=>{
    try {
        await callback()
    }catch(e){
        ErrorHint(e)
        return returnError(res, 900001)
    }
}

module.exports.recordLog = async (res,mid,user_type,user_id,action,url,content,status)=>{
    try {
        await UserAction.create({user_id,user_type,mid,action,url,content,status})
    }catch(e){
        ErrorHint(e)
        return returnError(res, 900001)
    }
}

module.exports.recordSysLog = async (res,req,action,url,content,status)=>{
    try {
        await UserAction.create({user_id:req.uid,user_type:0,mid:req.mid,action,url,content,status})
    }catch(e){
        ErrorHint(e)
        return returnError(res, 900001)
    }
}