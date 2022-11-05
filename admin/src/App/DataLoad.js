import { apiResult, sessionSet ,sessionGet} from "../Utils/Common"

const loadUserContent = (apis,callback,errorCallback) =>{
    let data = sessionGet('portalContent')
    if(data) {
        callback(data.serviceMenu)
    }
    apis.loginLoad().then(ret=>{
        apiResult(ret,(data)=>{
            //sessionSet("portalContent",data)
            callback(data)
        },errorCallback)
    })
}
const loadCoaches = (apis,callback,errorCallback)=>{
    let data = sessionGet('coaches')
    if(data) callback(data)
    apis.loadCoaches().then(ret=>{
        apiResult(ret,(data)=>{
            //sessionSet("portalContent",data)
            callback(data)
        },errorCallback)
    })
}
const loadCrmContent = (apis,callback,errorCallback)=>{
    let data = sessionGet('crmContent')
    if(data) {
        callback(data.serviceMenu)
    }
    apis.crmLoad().then(ret=>{
        apiResult(ret,(data)=>{
            //sessionSet("crmContent",data)
            callback(data.serviceMenu)
        },errorCallback)
    })
}
const loadEmailContent = (apis,callback,errorCallback)=>{
    let data = sessionGet('emailContent')
    if(data) {
        callback(data.serviceMenu)
    }
    apis.emailModuleLoad().then(ret=>{
        apiResult(ret,(data)=>{
            //sessionSet("emailContent",data)
            callback(data.serviceMenu)
        },errorCallback)
    })
}
const loadMemberContent = (apis,callback,errorCallback)=>{
    let data = sessionGet('memberContent')
    if(data) {
        callback(data.serviceMenu)
    }
    apis.memberLoad().then(ret=>{
        apiResult(ret,(data)=>{
            //sessionSet("memberContent",data)
            callback(data.serviceMenu)
        },errorCallback)
    })
}
const loadEventContent = (apis,callback,errorCallback)=>{
    let data = sessionGet('eventContent')
    if(data) {
        callback(data.serviceMenu)
    }
    apis.eventMenuLoad().then(ret=>{
        apiResult(ret,(data)=>{
            //sessionSet("memberContent",data)
            callback(data.serviceMenu)
        },errorCallback)
    })
}
const loadDashBoard = (apis,callback,errorCallback)=>{
    let data = sessionGet('dashboardContent')
    if(data) {
        callback(data)
    }
    apis.loadDashBoard().then(ret => {        
        apiResult(ret, (data) => {
            //sessionSet('dashboardContent')
            callback(data)
        }, errorCallback)
    })
}

export {loadUserContent,loadCrmContent,loadDashBoard,loadMemberContent,loadEventContent,loadEmailContent,loadCoaches}