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
const Role = model.Role
const RoleAuth = model.RoleAuth
const MenuTable = model.MenuTable
const BalanceType = model.BalanceType
const UserAction = model.UserAction

module.exports.user = {
    post:(req,res) =>{
        doWithTry(res,async(res)=>{
            let {email,passwd} = req.body
            passwd = md5(passwd)
            
        })
    },
    get:(req,res) => {

    },
    delete:(req,res)=>{

    },
    put:(req,res)=>{
        
    }
}