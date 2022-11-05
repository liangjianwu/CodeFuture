const model = require("../db/model");
const md5 = require("md5");
const { Util, errorMsg, Debug, ErrorHint, Log, Hint } = require('../components');
const appConfig = require('../configs/app.config');
const { returnSuccess, returnError, returnResult } = require("../components/errcode");
const { findOne, doWithTry } = require("./utils/Common");

const MemberInfoStruct = model.MemberInfoStruct

module.exports.getprofile = async(req,res)=>{
    
}

