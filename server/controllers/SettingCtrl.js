const model = require("../db/model");
const md5 = require("md5");
const { returnError, returnResult } = require("../components/errcode");
const { doWithTry } = require("./utils/Common");
const { Debug } = require("../components");

const User = model.MUser;
const UserRole = model.MUserRole
const UserProfile = model.MUserProfile
const Role = model.Role
const RoleAuth = model.RoleAuth
const MenuTable = model.MenuTable
const BalanceType = model.BalanceType
const Area = model.Area

module.exports.user = {
    post:(req,res) =>{
        doWithTry(res,async ()=>{
            let {email,passwd,firstname,lastname,phone,gender,area_id} = req.body
            let u = await User.findOne({where:{mid:req.mid,email:email}})
            if(u) {
                return returnError(res,100001)
            }
            passwd = md5(passwd)
            let user = await User.create({mid:req.mid,email:email,passwd:passwd,area_id:area_id,email_verified:1,status:1})
            if(user) {
                let data = {mid:req.mid,user_id:user.id,lastname:lastname,firstname:firstname,email:email}
                if(phone!=undefined) data.phone = phone
                if(gender!=undefined) data.gender = gender
                await UserProfile.create(data)
                //recordSysLog(res,req,'muser.create',req.path,JSON.stringify(req.body),1)                
                return returnResult(res,user.id)   
            }else {
                //recordSysLog(res,req,'muser.create',req.path,JSON.stringify(req.body),0)
                return returnError(res,190002)
            }
        })
    },
    get:(req,res) => {
        doWithTry(res,async ()=>{
            let {id} = req.query
            let where = {mid:req.mid}
            if(id>0) {
                where.id = id
            }
            User.hasOne(UserProfile,{foreignKey:'user_id'})
            User.belongsTo(Area,{foreignKey:'area_id'})
            let ret = id > 0 ? 
                await User.findOne({
                    where:where,
                    attributes:['id','email','area_id','email_verified','is_coach','is_assistant','status'],
                    include:[
                        {model:UserProfile,attributes:['firstname','lastname','gender','phone','email']},
                        {model:Area,attributes:['name','id','status'],where:{mid:req.mid,status:1},required:false},
                    ],                    
                }):
                await User.findAll({
                    where:where,
                    attributes:['id','email','area_id','email_verified','is_coach','is_assistant','status'],
                    include:[
                        {model:UserProfile,attributes:['firstname','lastname','gender','phone','email']},
                        {model:Area,attributes:['name','id','status'],where:{mid:req.mid,status:1},required:false},
                    ],
                    limit:100,
                    order:[['id','desc']],
                })
            //recordSysLog(res,req,'muser.get',req.path,id,1)      
            return returnResult(res,ret)
        })
    },
    delete:(req,res)=>{
        doWithTry(res,async ()=>{
            let id =req.query.id
            await User.update({status:0},{where:{mid:req.mid,id:id}})
            //recordSysLog(res,req,'muser.delete',req.path,id,1)      
            return returnResult(res,id)
        })
    },
    put:(req,res)=>{
        doWithTry(res,async ()=>{
            let {email,passwd,firstname,lastname,phone,gender,status,id,is_coach,is_assistant,area_id} = req.body                 
            let data = {}
            if(email) {                
                data.email = email
                data.email_verified = 1
            }
            if(passwd) {
                data.passwd = md5(passwd)
            }
            if(status>=0) {
                data.status = status
            }
            if(is_coach>=0) {
                data.is_coach = is_coach
            }
            if(is_assistant>=0) {
                data.is_assistant = is_assistant
            }
            if(area_id >= 0) {
                data.area_id = area_id
            }
            if(Object.keys(data).length > 0) {
                await User.update(data,{where:{mid:req.mid,id:id}})
            }
            let profile = {}
            if(firstname!=undefined) profile.firstname = firstname
            if(lastname!=undefined) profile.lastname = lastname            
            if(phone!=undefined) profile.phone = phone
            if(gender!=undefined) profile.gender = gender            
            if(Object.keys(profile).length>0) {
                await UserProfile.update(profile,{where:{mid:req.mid,id:id}})
            }
            //recordSysLog(res,req,'muser.update',req.path,JSON.stringify(req.body),1)      
            return returnResult(res,id)   
        })
    }
}

module.exports.role = {
    post:(req,res) =>{
        doWithTry(res,async ()=>{
            let {name,note} = req.body
            let r = await Role.findOne({where:{mid:req.mid,name:name}})
            if(r) {
                return returnError(res,900007)
            }
            let role = await Role.create({mid:req.mid,name:name,note:note,status:1})
            if(role) {     
                //recordSysLog(res,req,'role.create',req.path,JSON.stringify(req.body),1)                 
                return returnResult(res,role.id)   
            }else {
                //recordSysLog(res,req,'role.create',req.path,JSON.stringify(req.body),0)      
                return returnError(res,900006)
            }
        })
    },
    get:(req,res) => {
        doWithTry(res,async ()=>{
            let {id} = req.query
            let ret = id>0?await Role.findOne({where:{mid:req.mid,id:id}}):await Role.findAll({where:{mid:req.mid},limit:100,order:[['id','desc']]})
            //recordSysLog(res,req,'role.get',req.path,id,1)      
            return returnResult(res,ret)
        })
    },
    delete:(req,res)=>{
        doWithTry(res,async ()=>{
            let id =req.query.id
            await Role.update({status:0},{where:{mid:req.mid,id:id}})
            //recordSysLog(res,req,'role.delete',req.path,id,1)   
            return returnResult(res,id)
        })
    },
    put:(req,res)=>{
        doWithTry(res,async ()=>{
            let {name,note,status,id} = req.body
            let data = {}
            if(name != undefined) data.name = name
            if(note != undefined) data.note = note
            if(status != undefined ) data.status = status
            if(Object.keys(data).length>0) {
                await Role.update(data,{where:{mid:req.mid,id:id}})
            }
            //recordSysLog(res,req,'role.update',req.path,id,1)      
            return returnResult(res,id)               
        })
    }
}
module.exports.menu = {
    post:(req,res) =>{
        doWithTry(res,async ()=>{
            let {type,name,description,url,parent_id,method,position} = req.body            
            let menu = await MenuTable.create({mid:req.mid,type,name,description,url,parent_id,method,position})
            if(menu) {
                //recordSysLog(res,req,'menu.create',req.path,JSON.stringify(req.body),1)      
                return returnResult(res,menu.id)   
            }else {
                //recordSysLog(res,req,'menu.create',req.path,JSON.stringify(req.body),0)
                return returnError(res,900006)
            }
        })
    },
    get:(req,res) => {
        doWithTry(res,async ()=>{
            let {id} = req.query
            let ret = id>0?await MenuTable.findOne({where:{mid:[0,req.mid],id:id}}):await MenuTable.findAll({where:{mid:[0,req.mid]},limit:500,order:[['id','desc']]})
            //recordSysLog(res,req,'menu.get',req.path,id,0)
            return returnResult(res,ret)
        })
    },
    delete:(req,res)=>{
        doWithTry(res,async ()=>{
            let id =req.query.id
            await MenuTable.update({status:0},{where:{mid:req.mid,id:id}})
            //recordSysLog(res,req,'menu.delete',req.path,id,0)
            return returnResult(res,id)
        })
    },
    put:(req,res)=>{
        doWithTry(res,async ()=>{
            let {type,name,description,url,id,status,parent_id,method,position} = req.body
            let data = {}
            if(name != undefined) data.name = name
            if(type != undefined) data.type = type            
            if(description != undefined) data.description = description
            if(url != undefined) data.url = url            
            if(status != undefined ) data.status = status
            if(parent_id != undefined) data.parent_id = parent_id
            if(method != undefined) data.method = method
            if(position != undefined) data.position = position
            if(Object.keys(data).length>0) {
                await MenuTable.update(data,{where:{mid:req.mid,id:id}})
            }
            return returnResult(res,id)               
        })
    }
}

module.exports.roleauth = {
    post:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {role_id,menu_id} = req.body
            let ra = await RoleAuth.findOne({where:{mid:req.mid,role_id,menu_id}})
            if(ra) {
                return returnError(res,900007)
            }else {
                let ra = await RoleAuth.create({mid:req.mid,role_id,menu_id,status:1})
                if(ra) {
                    return returnResult(res,ra.id)
                }else {
                    return returnError(res,900006)
                }
            }
        })
    },
    get:async(req,res)=>{
        doWithTry(res,async ()=> {
            let {id} = req.query
            RoleAuth.belongsTo(Role,{foreignKey:'role_id'})
            RoleAuth.belongsTo(MenuTable,{foreignKey:'menu_id'})
            let ras = await RoleAuth.findAll({
                attributes:['id','role_id','menu_id','status'],
                where:{mid:req.mid,role_id:id},
                include:[
                    {model:Role,attributes:['id','name'],where:{mid:req.mid,status:1}},
                    {model:MenuTable,attributes:['id','name','type','url','status'],where:{mid:[0,req.mid]}},
                ],
                limit:300,order:[['id','desc']],
            })
            return returnResult(res,ras)
        })
    },
    delete:async(req,res)=> {
        doWithTry(res,async ()=>{
            let {id} = req.query
            await RoleAuth.update({status:0},{where:{mid:req.mid,id:id}})
            return returnResult(res,id)
        })
    },
    put:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {status,id} = req.body
            await RoleAuth.update({status:status},{where:{mid:req.mid,id:id}})
            return returnResult(res,id)
        })
    }
}
module.exports.userrole = {
    post:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {role_id,user_id} = req.body
            let ra = await UserRole.findOne({where:{mid:req.mid,role_id,user_id}})
            if(ra) {
                ra.status = 1
                await ra.save()
                return returnResult(res,ra.id)
            }else {
                let ra = await UserRole.create({mid:req.mid,role_id,user_id,status:1})
                if(ra) {
                    return returnResult(res,ra.id)
                }else {
                    return returnError(res,900006)
                }
            }
        })
    },
    get:async(req,res)=>{
        doWithTry(res,async ()=> {
            let {user_id,role_id} = req.query
            UserRole.belongsTo(Role,{foreignKey:'role_id'})
            UserRole.belongsTo(UserProfile,{foreignKey:'user_id',targetKeyy:'user_id'})
            let where = {mid:req.mid}
            if(user_id>0) where.user_id = user_id
            if(role_id>0) where.role_id = role_id

            let ras = await UserRole.findAll({
                attributes:['id','role_id','user_id','status'],
                where:where,
                include:[
                    {model:Role,attributes:['id','name'],where:{mid:req.mid,status:1}},
                    {model:UserProfile,attributes:['id','firstname','lastname'],where:{mid:req.mid}},
                ],
                limit:20,order:[['id','desc']]})
            return returnResult(res,ras)
        })
    },
    delete:async(req,res)=> {
        doWithTry(res,async ()=>{
            let {id} = req.query
            await UserRole.update({status:0},{where:{mid:req.mid,id:id}})
            return returnResult(res,id)
        })
    },
    put:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {status,id} = req.body
            await UserRole.update({status:status},{where:{mid:req.mid,id:id}})
            return returnResult(res,id)
        })
    }
}
module.exports.balance = {
    post:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {type,level} = req.body
            let bt = await BalanceType.findOne({where:{mid:req.mid,type:type}})
            if(bt) {
                return returnError(res,900007)
            }
            bt = await BalanceType.create({mid:req.mid,type:type,level:level,status:1})
            return returnResult(res,bt.id)
        })
    },
    put:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {id,type,level,status} = req.body
            let data = {}
            if(type>=0) data.type = type
            if(level>=0) data.level = level
            if(status>=0) data.status = status
            if(Object.keys(data).length> 0) {
                await BalanceType.update(data,{where:{id:id,mid:req.mid}})
            }
            return returnResult(res,id)
        })
    },
    get:async(req,res)=>{
        doWithTry(res,async ()=>{
            let ret = await BalanceType.findAll({where:{mid:req.mid},attributes:['id','type','level','status'],limit:10,order:[['id','desc']]})
            return returnResult(res,ret)
        })
    },
    delete:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {id} = req.query
            await BalanceType.update({status:0},{where:{mid:req.mid,id:id}})
            return returnResult(res,id)
        })
    }
}

module.exports.area = {
    post:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {name,description} = req.body
            let bt = await Area.findOne({where:{mid:req.mid,name:name}})
            if(bt) {
                return returnError(res,900007)
            }
            bt = await Area.create({mid:req.mid,name:name,description:description,status:1})
            return returnResult(res,bt.id)
        })
    },
    put:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {id,name,description,status} = req.body
            let data = {}
            if(name != undefined) data.name = name
            if(description != undefined) data.description = description
            if(status>=0) data.status = status
            if(Object.keys(data).length> 0) {
                await Area.update(data,{where:{id:id,mid:req.mid}})
            }
            return returnResult(res,id)
        })
    },
    get:async(req,res)=>{
        doWithTry(res,async ()=>{
            let ret = await Area.findAll({where:{mid:req.mid},attributes:['id','name','description','status'],limit:10,order:[['id','desc']]})
            return returnResult(res,ret)
        })
    },
    delete:async(req,res)=>{
        doWithTry(res,async ()=>{
            let {id} = req.query
            await Area.update({status:0},{where:{mid:req.mid,id:id}})
            return returnResult(res,id)
        })
    }
}

