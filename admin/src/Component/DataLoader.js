const { sessionGet, sessionSet, apiResult } = require("../Utils/Common")

const loadAreas = (apis,callback,setError)=>{
    let datas = sessionGet('areas')
    if(datas) {
        callback(datas)
    }else {
        apis.areaGet(0).then(ret=>{
            apiResult(ret,(areas)=>{
                sessionSet('areas',areas)
                callback(areas)
            },setError)
        })
    }
}
const loadProducts = (apis,callback,setError)=>{
    let datas = sessionGet('products')
    if(datas) {
        callback(datas)
    }else {
        apis.loadProducts(0,1000,0).then(ret=>{
            apiResult(ret,(areas)=>{
                sessionSet('products',areas.data)
                callback(areas.data)
            },setError)
        })
    }
}
const loadRoles = (apis,callback,setError)=>{
    let datas = sessionGet('roles')
    if(datas) {
        callback(datas)
    }else {
        apis.roleGet(0).then(ret=>{
            apiResult(ret,(roles)=>{
                sessionSet('roles',roles)
                callback(roles)
            },setError)
        })
    }
}
const loadBalanceTypes = (apis,callback,setError)=>{
    let datas = sessionGet('balancetypes')
    if(datas) {
        callback(datas)
    }else {
        apis.balanceGet(0).then(ret=>{
            apiResult(ret,(balancetypes)=>{
                sessionSet('balancetypes',balancetypes)
                callback(balancetypes)
            },setError)
        })
    }
}
export {
    loadAreas,
    loadProducts,
    loadRoles,
    loadBalanceTypes,
}