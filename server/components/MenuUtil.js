const req = require("express/lib/request");
const { AppsList } = require("../configs/AppList")
const db = require('../db/db');
const model = require('../db/model');
const { ErrorHint, Debug } = require("./console");
const checkCode =(code,code1)=> {
    if(code === '*') return true
    if(code.indexOf('*')>=0) {
        let code2 = code.replace('*','')               
        if(code1 === code2 ||code1.indexOf(code2) === 0) {
            return true
        }else  {
            return false
        }
    }else {
        return code === code1
    }
}
const searchMenu = (menus, code) => {
    for (let i = 0; i < menus.length; i++) {                                   
        if (checkCode(code,menus[i].code)) {
            menus[i].isMenu && (menus[i].auth = true)            
            if(code.indexOf('*')<0)
                return true
        }
        if (menus[i].items && menus[i].items.length > 0) {
            if (searchMenu(menus[i].items, code)) {
                menus[i].auth = true
                if(code.indexOf('*')<0)                
                    return true
            }
        }
        
    }
}
const cleanMenu = (menus) => {    
    for (let i = menus.length - 1; i >= 0; i--) {
        //Debug([menus[i].name,menus[i].auth,menus[i].isMenu])
        if (!menus[i].auth || !menus[i].isMenu) {
            //Debug([menus[i].name,menus[i].auth,menus[i].isMenu,!menus[i].auth || !menus[i].isMenu])
            menus.splice(i, 1)
        }else {
            menus[i].items && menus[i].items.length>0 && cleanMenu(menus[i].items)            
        }
    }       
    return menus
}
const createMenu = (auths,appid) => {    
    let menus = AppsList.getMenuData(appid)      
    auths.map((auth, index) => {
        let codes = auth.authtree && auth.authtree.length > 0 ? auth.authtree.split(",") : [] 
        codes.map((code, index) => {            
            searchMenu(menus, code)
        })
    })
    return cleanMenu(menus)

}
module.exports.loadMenu = async (userid,appid) => {    
    try {    
        // UserRole.belongsTo(RoleAuth,{foreignKey:'role_id',})
        // RoleAuth.hasMany(UserRole,{foreignKey:'role_id'})
        // let auths = await RoleAuth.findAll({ where:{app_id:appid,status:1},include:[{model:UserRole,where:{user_id:userid,status:1}}]})
        const auths = await db.sequelize.query("select A.* from role_auth A,muser_role B where B.user_id="+userid + " and A.role_id = B.role_id", { type: db.Sequelize.QueryTypes.SELECT });                                
        return createMenu(auths,appid)
    }catch(e) {
        ErrorHint(e)
        return false
    }    
}
