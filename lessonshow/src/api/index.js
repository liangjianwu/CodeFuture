import axios from 'axios'
import { hex_md5 } from 'react-native-md5'
const api = axios.create({
    baseURL: '/memberapi',
    //baseURL: 'http://localhost/sales',
})
const signIn = (userInfo, headers) => api.post(`/user/login`, userInfo, headers)
const signOut = (headers)=>api.get(`/user/signout`,headers)
const signUp = (userInfo, headers) => api.post(`/user/register`, userInfo, headers)
const sendCode = (data,headers) =>api.post(`/user/sendcode`,data,headers)
const sendCode1 = (data,headers) =>api.post(`/user/sendcode1`,data,headers)
const resetPwd = (data,headers) => api.post(`/user/resetpwd`,data,headers)
const emailVerify = (data,headers) => api.post(`/user/verifycode`,data,headers)
const loadUseProfile = (headers)=>api.get(`/user/profile`,headers)
const modifyUserProfile = (data,headers)=>api.post(`/user/profile`,data,headers)
const setHeader = (k, v) => {
    api.defaults.headers.post[k] = v
    api.defaults.headers.get[k] = v
    api.defaults.headers.put[k] = v
    api.defaults.headers.delete[k] = v
}

const apis = {
    signIn,
    signOut,
    signUp,
    resetPwd,
    sendCode,sendCode1,
    emailVerify,
    loadUseProfile,
    setHeader,
    modifyUserProfile,  
    getEvent:(code,applyid,token,time,headers)=>api.get( `/event/getevent?code=`+code+(applyid>0?(`&applyid=`+applyid+`&token=`+token+`&time=`+time):''),headers),      
    applyEvent:(data,headers)=>api.post(`/event/applyevent`,data,headers),
    payEvent:(data,headers)=>api.post(`/event/payevent`,data,headers),
    loadEvents:(headers)=>api.get('/event/loadevents',headers),
    loadApplicants:(code,headers)=>api.get('/event/loadapplicants?code='+code,headers),
    //home
    loadResources:(type,resourcetype,page,pagesize,countdata,headers) => api.get(`/home/loadresources?type=`+type+`&resource_type=`+resourcetype+`&page=`+page+'&pagesize='+pagesize+'&countdata='+countdata+`&time=`+Date.now(),headers),
    //pay
    setupPay:(id,code,headers)=>api.post('/event/setuppay',{id:id,code:code},headers),
    //lesson
    lessonGet:(id,headers)=>api.get('/lesson/lesson?id='+id,headers),
}

export default apis
