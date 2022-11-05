const { returnResult, returnError, returnSuccess } = require("../../components/errcode")
const model = require("../../db/model");
const { doWithTry } = require("../../controllers/utils/Common");
const Resource = model.Resource

var pathlib = require("path");

module.exports.loadResources = async(req,res)=>{
    doWithTry(res,async()=>{
        let {type,page,pagesize,countdata,resource_type} = req.query
        let retdata = {total:0,data:[]}
        if(countdata == 1) {
            retdata.total = await Resource.count({where:{mid:req.mid,type:type,status:1,resource_type:resource_type}})            
        }        
        retdata.data = await Resource.findAll({where:{mid:req.mid,type:type,status:1,resource_type:resource_type},order:[['id','desc']],limit:Number(pagesize),offset:Number(pagesize)*Number(page)})
        return returnResult(res,retdata)
    })
}
module.exports.photo = async(req,res)=>{
    
    let {file} = req.query
    let a = file.split('.')
    if(a.length != 2 || isNaN(a[0]) || (a[1] != 'jpg' && a[1] != 'jpeg' && a[1] != 'png')) {
        return returnError(res,900001)
    }
    // res.setHeader("Content-Type", "image/jpeg,image/png")
    res.sendFile(pathlib.resolve('./upload/'+file))

}
