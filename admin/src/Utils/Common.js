import { hex_md5 } from 'react-native-md5'
const apiResult = (ret,successCallback,failCallback,fieldCheckCallback)=>{
    if(ret.status === 200 && ret.data.success) {
        successCallback(ret.data.data)
    }else {
        if(ret.data.data.errcode === 990000) {
            let es = {}
            ret.data.data.errors.map((item) => {
                es = {...es,[item.param]:item.msg}
                return true
            })
            fieldCheckCallback ? fieldCheckCallback(es):failCallback('Parameters error')
        }else if([900002,900003,900004].indexOf(ret.data.data.errcode)>=0 ){
            setUserSession()
            window.location.href = "/account/signin"
        }else {
            failCallback(ret.data.data.error)
        }
    }
}
const formToJson = (formData)=>{
    const data = {};
    formData.forEach((value, key) => {
        data[key] = key === 'passwd' ?(value && value.length>0?hex_md5(value):undefined):value        
    });
    return data;
}
const cleanJson = (formData)=>{
    const data = {};
    const keys = Object.keys(formData)
    keys.map(k=>{
        if(formData[k] != null) {
            data[k] = formData[k]
        }
    })
    return data;
}

const sessionSet = (key,value)  => {
    if(!value) {
        sessionStorage.removeItem(key)
        return
    }
    const data = {data:value}
    sessionStorage.setItem(key,JSON.stringify(data))
}
const sessionGet = (key) => {
    let value =  sessionStorage.getItem(key)
    value =  value ? JSON.parse(value):value
    return value?value.data:value
}
const cacheSet = (key,value) => {
    if(!value) {
        localStorage.removeItem(key)
        return        
    }
    localStorage.setItem(key,JSON.stringify({data:value}))
}

const cacheGet = (key) => {
    let value =  localStorage.getItem(key)
    value =  value ? JSON.parse(value):value
    return value?value.data:value
}
const getUserSession = (apis)=> {
    let session = sessionGet('session')
    session = session?session:cacheGet('session')
    //console.log([session.expired_time,Date.now()])
    if(session) {
        if(session.expired_time < Date.now()) {
            sessionSet('session',undefined)
            cacheSet('session',undefined)
            return undefined
        }
        if(apis) {
            const time = Date.now()
            apis.setHeader('request-userid',session.userid)
            apis.setHeader('request-appid',0)
            apis.setHeader('request-token',hex_md5(session.token+time))
            apis.setHeader('request-time',time)
        }
    }else {
        session = sessionGet('coach_session')
        session = session?session:cacheGet('coach_session')
        if(session && session.expired_time < Date.now()) {
            sessionSet('coach_session',undefined)
            cacheSet('coach_session',undefined)
            return undefined
        }
        if(session && apis) {
            const time = Date.now()
            apis.setHeader('request-coachid',session.userid)
            apis.setHeader('request-appid',0)
            apis.setHeader('request-token',hex_md5(session.token+time))
            apis.setHeader('request-time',time)
        }
    }
    return session
}
const setUserSession = (data,cache=false)=>{
    sessionSet('session',data)
    if(data) {    
        const session = cacheGet('session')
        if(session && session.expired_time > Date.now() ) {
            cacheSet('session',data)
        }else if(cache) {
            cacheSet('session',data)
        }
    }else {
        cacheSet('session',undefined)
    }
}
const setCoachSession = (data,cache=false)=>{
    data && (data.isCoach = true)
    sessionSet('coach_session',data)
    if(data) {    
        const session = cacheGet('coach_session')
        if(session && session.expired_time > Date.now() ) {
            cacheSet('coach_session',data)
        }else if(cache) {
            cacheSet('coach_session',data)
        }
    }else {
        cacheSet('coach_session',undefined)
    }
}
const getVarsFromString = (str)=>{
    const arrs = str.split("%")
    const rets = []
    for(let i=0;i<arrs.length;i++) {
        i%2 === 1 && arrs[i].substring(0,1) === "_" &&  rets.push(arrs[i])
    }
    return rets
}

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
const getCurrentMonth01 = () => {
    let d = new Date()
    let m = d.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let y = d.getFullYear()
    return y + '-' + m + '-01'
}


const getDatesInRange = (startDate, endDate) => {
    const date = new Date(startDate);
    const date1 = new Date(endDate)
    const dates = [];
    //console.log([startDate,endDate,date,date1])
    while (date <= date1) {
        let m = date.getMonth()+1
        let d = date.getDate()
        //dates.push(date.getFullYear()+'-'+(m<10?('0'+m):m)+ '-' + (d<10?('0'+d):d))
        dates.push(new Date(date).toISOString().substring(0,10));
        date.setDate(date.getDate() + 1);
    }
    return dates;
  }
export {apiResult,formToJson,sessionSet,sessionGet,cacheSet,cacheGet,getUserSession,setCoachSession,setUserSession,getVarsFromString,formatDate,getCurrentMonth01,cleanJson,getDatesInRange}