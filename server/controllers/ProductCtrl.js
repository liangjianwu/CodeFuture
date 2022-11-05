const { returnResult, returnError, returnSuccess } = require("../components/errcode")
const model = require("../db/model");
const Sequelize = require('sequelize');
const { ErrorHint, Debug } = require("../components");
const { doWithTry } = require("./utils/Common");
const MerchantProduct = model.Product
const Coach = model.Coach
module.exports.loadProducts = async (req, res) => {
    let { page, pagesize, countdata } = req.query
    pagesize = Number(pagesize)
    page = Number(page)
    let uid = req.uid
    MerchantProduct.hasOne(Coach,{sourceKey:'coach_id',foreignKey:'id'})
    doWithTry(res,async()=>{
        let where = { mid: req.mid,status:1 }                    
        let ret = { total: 0 }
        if (countdata) {
            ret.total = await MerchantProduct.count({ where: where })
        }
        ret.data = await MerchantProduct.findAll({
             where: where, order: [['name', 'desc']], 
             include:[{model:Coach,attributes:['id','name']}],
             limit: pagesize, 
             offset: page * pagesize
        })
        return returnResult(res, ret)
    })
}

module.exports.editProduct = async(req,res) => {    
    doWithTry(res,async ()=>{
        if(req.body.id > 0) {
            let where = {id:req.body.id,mid:req.mid}            
            await MerchantProduct.update(req.body,{where:where})
        }else {
            req.body.mid = req.mid            
            await MerchantProduct.create(req.body)
        }            
        return returnSuccess(res,100001)
    }) 
}

module.exports.removeProduct = async(req,res) => {
    try {        
        let ids = req.body.ids
        Debug(ids)
        let mu = await MerchantUser.findOne({ where: { user_id: req.uid, status: 1 } })
        if (mu) {
            let where = {id:{[Sequelize.Op.in]:ids},merchant_id:mu.merchant_id}
            if(mu.data_individual_type === 1) where.user_id = req.uid
            await MerchantProduct.update({status:0},{where:where})
            return returnSuccess(res,100001)
        } else {
            return returnError(res, 300001)
        }
    } catch (e) {
        ErrorHint(e)
        return returnError(res, 900001)
    }
}