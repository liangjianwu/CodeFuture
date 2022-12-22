import axios from 'axios'
import { hex_md5 } from 'react-native-md5'
const api = axios.create({
    baseURL: '/api',
    //baseURL: 'http://localhost/sales',
})
const setAppAuthHeaders = (appAuthParams) => {
    api.defaults.headers.post['request-app-id'] = appAuthParams.appid
    api.defaults.headers.post['request-app-token'] = appAuthParams.apptoken
    api.defaults.headers.post['request-app-time'] = appAuthParams.apptime
    api.defaults.headers.post['request-app-from'] = appAuthParams.appfrom
}
const setHeader = (k, v) => {
    api.defaults.headers.post[k] = v
    api.defaults.headers.get[k] = v
    api.defaults.headers.put[k] = v
    api.defaults.headers.delete[k] = v
}
const getAppAUthHeadersConfig = (appAuthParams) => {
    return {
        headers: {
            'request-app-id': appAuthParams.appid,
            'request-app-token': appAuthParams.apptoken,
            'request-app-time': appAuthParams.apptime,
            'request-app-from': appAuthParams.appfrom,
        }
    }

}
const signIn = (userInfo, headers) => api.post(`/user/login`, userInfo, headers)
const signOut = (headers)=>api.get(`/user/signout`,headers)
const signUp = (userInfo, headers) => api.post(`/user/register`, userInfo, headers)
const sendCode = (data,headers) =>api.post(`/user/sendcode`,data,headers)
const sendCode1 = (data,headers) =>api.post(`/user/sendcode1`,data,headers)
const resetPwd = (data,headers) => api.post(`/user/resetpwd`,data,headers)
const emailVerify = (data,headers) => api.post(`/user/verifycode`,data,headers)
const loadUseProfile = (headers)=>api.get(`/user/profile`,headers)
const modifyUserProfile = (data,headers)=>api.post(`/user/profile`,data,headers)

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
    coachSignIn:(userInfo,headers)=>api.post(`/user/coachlogin`,userInfo,headers),
    //sysstem
    loginLoad:(headers)=>api.get(`/service/loginload?time=`+Date.now(),headers),
    applyService:(appid,headers)=>api.post(`/service/applyservice`,{appid:appid},headers),
    loadServices:(headers)=>api.get(`/service/services`,headers),
    loadDashBoard:(headers)=>api.get(`/service/dashboard`,headers),
    //crm
    crmLoad:(headers)=>api.get(`/member/loginload`,headers),
    loadCustomer:(page,pagesize,countdata,showOption,orderfield,order,headers)=>api.get(`/member/loadcustomer?status=`+showOption+`&orderfield=`+orderfield+`&order=`+order+`&countdata=`+countdata+`&page=`+page+`&pagesize=`+pagesize+`&time=`+Date.now(),headers),
    loadUser:(page,pagesize,countdata,showOption,orderfield,order,headers)=>api.get(`/member/loaduser?status=`+showOption+`&countdata=`+countdata+`&page=`+page+`&pagesize=`+pagesize+`&orderfield=`+orderfield+`&order=`+order+`&time=`+Date.now(),headers),
    editCustomer:(data,headers)=>api.post(`/member/editcustomer`,data,headers),
    editUser:(data,headers)=>api.post(`/member/edituser`,data,headers),
    getCustomer:(id,headers)=>api.get(`/member/getcustomer?id=`+id,headers),
    customerSearch:(data,page,rows,countdata,showOption,headers)=>api.get(`/member/searchcustomer?status=`+showOption+`&value=`+encodeURIComponent(data) + '&page='+page+'&pagesize='+rows+'&countdata='+countdata+`&time=`+Date.now(),headers),
    userSearch:(data,page,rows,countdata,showOption,headers)=>api.get(`/member/searchuser?status=`+showOption+`&value=`+encodeURIComponent(data) + '&page='+page+'&pagesize='+rows+'&countdata='+countdata+`&time=`+Date.now(),headers),
    loadMemberInfoStruct:(headers)=>api.get(`/member/getmemberinfostruct`,headers),
    setMemberInfoStruct:(data,headers)=>api.post(`/member/setmemberinfostruct`,data,headers),
    changeMemberStatus:(id,status,headers)=>api.post(`/member/changememberstatus`,{id:id,status:status},headers),
    changeMemberLevel:(id,level,headers)=>api.post(`/member/changememberlevel`,{id:id,level:level},headers),
    changeUserStatus:(id,status,headers)=>api.post(`/member/changeuserstatus`,{id:id,status:status},headers),
    //member
    memberLoad:(headers)=>api.get(`/accounting/loginload`,headers),
    loadFamilys:(page,pagesize,countdata,field,order,headers)=>{
        field = field?field:'id'
        order = order?order:'desc'
        return api.get(`/accounting/loadfamilys?countdata=`+countdata+`&page=`+page+`&pagesize=`+pagesize+'&orderfield='+field + '&order=' + order +`&time=`+Date.now(),headers)
    },
    balanceSnapshot:(page,pagesize,countdata,field,order,snapdate,headers)=>{
        field = field?field:'id'
        order = order?order:'desc'
        return api.get(`/accounting/balancesnapshot?snap_date=`+snapdate+`&countdata=`+countdata+`&page=`+page+`&pagesize=`+pagesize+'&orderfield='+field + '&order=' + order +`&time=`+Date.now(),headers)
    },
    snapshotBalance:(headers)=>api.get(`/accounting/snapshotbalance`,headers),
    loadMembers:(page,pagesize,countdata,headers)=>api.get(`/accounting/loadmembers?countdata=`+countdata+`&page=`+page+`&pagesize=`+pagesize+`&time=`+Date.now(),headers),
    recharge:(data,headers)=>api.post(`/accounting/recharge`,data,headers),
    userbalanceRecharge:(data,headers) => api.post('/accounting/userbalance',data,headers),
    bcharge:async (data,headers)=>{return await api.post(`/accounting/charge`,data,headers)},
    charge:(data,headers)=>api.post(`/accounting/charge`,data,headers),
    memberSearch:(data,page,rows,countdata,headers)=>api.get(`/accounting/searchmember?value=`+encodeURIComponent(data) + '&page='+page+'&pagesize='+rows+'&countdata='+countdata+`&time=`+Date.now(),headers),
    familyBalanceSearch:(data,page,rows,countdata,field,order,headers)=>api.get(`/accounting/searchfamily?value=`+encodeURIComponent(data) + '&orderfield='+field + '&order=' + order + '&page='+page+'&pagesize='+rows+'&countdata='+countdata+`&time=`+Date.now(),headers),
    getGroupMembers:(id,page,rows,countdata,headers)=>api.get(`/accounting/getgroupmembers?id=`+id + '&page='+page+'&pagesize='+rows+'&countdata='+countdata+`&time=`+Date.now(),headers),
    loadTransactions:(page,pagesize,countdata,fid,kid,orderfield,order,coache,product,from,to,headers) => api.get(`/accounting/loadtransactions?fid=`+fid+`&kid=`+kid+`&orderfield=`+orderfield+`&order=`+order+`&countdata=`+countdata+`&page=`+page+`&pagesize=`+pagesize+`&coache=`+coache+`&product=`+product+`&from=`+from+`&to=`+to+`&time=`+Date.now(),headers),
    refund:(data,headers)=>api.post(`/accounting/refund`,data,headers),
    cancelTransaction:(id,headers)=>api.post(`/accounting/canceltransaction`,{id:id},headers),
    gettransaction:(data,headers)=>api.post('/accounting/gettransaction',data,headers),
    editTransaction:(data,headers)=>api.post('/accounting/edittransaction',data,headers),
    getAccountingReport:(from,to,orderfield,order,headers) => api.get('/accounting/getreport?from='+from+'&to='+to+(orderfield && order?('&orderfield='+orderfield + '&order='+order):""),headers),
    
    //product
    loadProducts:(page,rows,countdata,headers)=>api.get(`/product/loadproducts?page=`+page+'&pagesize='+rows+'&countdata='+countdata+`&time=`+Date.now(),headers),
    editProduct:(data,headers)=>api.post(`/product/editproduct`,data,headers),
    removeProduct:(ids,headers)=>api.post(`/product/removeproduct`,ids,headers),
    //group
    createGroup:(data,headers) => api.post(`/member/creategroup`,data,headers),
    getGroups:(headers)=>api.get(`/member/getgroups`,headers),
    getGroupCustomers:(ids,page,rows,countdata,showOption,headers)=>api.get(`/member/getgroupcustomers?status=`+showOption+`&id=`+ids + '&page='+page+'&pagesize='+rows+'&countdata='+countdata+`&time=`+Date.now(),headers),
    addToGroup:(ids,groups,headers)=>api.post(`/member/addtogroup`,{ids:ids,groups:groups},headers),
    removeFromGroup:(data,headers)=>api.post(`/member/removefromgroup`,data,headers),
    //merchant
    userMerchant:(headers)=>api.get(`/service/merchant?time=`+Date.now(),headers),
    merchantPwd:(headers)=>api.get(`/service/merchantpwd?time=`+Date.now(),headers),
    addCompany:(data,headers)=>api.post(`/service/addcompany`,data,headers),
    joinCompany:(data,headers)=>api.post(`/service/joincompany`,data,headers),
    uploadCustomers:(session)=>{
        let time = Date.now()
        return {
            url:'/api/upload/customersfile',
            headers:{
                'request-userid':session.userid,
                'request-appid':0,
                'request-token':hex_md5(session.token+time),
                'request-time':time
            }
        }},
    //coach
    loadCoaches:(headers)=>api.get(`/coach/loadcoaches`,headers),
    editCoach:(data,headers)=>api.post(`/coach/editcoach`,data,headers),
    removeCoach:(id,headers)=>api.get(`/coach/remove?id=`+id,headers),
    loadCoachRecord:(id,from,to,headers)=>api.get(`/coach/loadcoachrecord?id=`+id+'&from='+from+'&to='+to,headers),
    loadCoachTime:(id,page,pagesize,countdata,headers) =>api.get(`/coach/loadcoachtime?id=`+id+`&page=`+page+'&pagesize='+pagesize+'&countdata='+countdata+`&time=`+Date.now(),headers),
    loadSchedules:(data,coach_id,member_id,from,headers)=>api.get(`/coach/loadschedule?data=`+data+`&coach_id=`+coach_id+`&member_id=`+member_id+(from ?(`&from=`+from):''),headers),
    addSchedule:(data,headers)=>api.post(`/coach/addschedule`,data,headers),
    deleteSchedule:(data,headers)=>api.post(`/coach/deleteschedule`,data,headers),
    editSchedule:(data,headers)=>api.post(`/coach/editschedule`,data,headers),
    //email
    emailModuleLoad:(headers)=>api.get(`/email/loginload`,headers),
    loadTemplates:(page,pagesize,countdata,headers) =>api.get(`/email/loadtemplates?page=`+page+'&pagesize='+pagesize+'&countdata='+countdata+`&time=`+Date.now(),headers),
    getTemplate:(id,headers)=>api.get( `/email/gettemplate?id=`+id,headers),
    editTemplate:(data,headers) => api.post(`/email/edittemplate`,data,headers),
    removeTemplate:(data,headers)=>api.post(`/email/removetemplate`,data,headers),
    cloneTemplate:(data,headers)=>api.post(`/email/clonetemplate`,data,headers),
    editEmailTask:(data,headers)=>api.post(`/email/edittask`,data,headers),
    loadEmailTasks:(page,pagesize,countdata,headers) =>api.get(`/email/loadtasks?page=`+page+'&pagesize='+pagesize+'&countdata='+countdata+`&time=`+Date.now(),headers),
    getEmailTask:(id,headers)=>api.get( `/email/gettask?id=`+id,headers), 
    setTaskStatus:(id,status,headers)=>api.post(`/email/settaskstatus`,{id:id,status:status},headers),           
    loadHouse:(id,headers)=>api.get(`/email/gethouse?id=`+id,headers),
    loadTaskResult:(id,headers)=>api.get(`/email/loadtaskresult?id=`+id,headers),
    //event
    eventMenuLoad:(headers)=>api.get(`/event/loginload`,headers),
    loadEvents:(page,pagesize,countdata,headers) =>api.get(`/event/loadevents?page=`+page+'&pagesize='+pagesize+'&countdata='+countdata+`&time=`+Date.now(),headers),
    getEvent:(id,headers)=>api.get( `/event/getevent?id=`+id,headers),
    editEvent:(data,headers) => api.post(`/event/editevent`,data,headers),
    removeEvent:(data,headers)=>api.post(`/event/removeevent`,data,headers),
    cloneEvent:(data,headers)=>api.post(`/event/cloneevent`,data,headers),
    setEventStatus:(id,status,headers)=>api.post(`/event/setstatus`,{id:id,status:status},headers),
    setEventPublishStatus:(id,status,headers)=>api.post(`/event/setpublishstatus`,{id:id,status:status},headers),
    loadApplicants:(id,page,size,countdata,headers) =>api.get(`/event/loadapplicants?id=`+id+`&page=`+page+'&pagesize='+size+'&countdata='+countdata+`&time=`+Date.now(),headers),

    //resource
    uploadResource:(session)=>{
        let time = Date.now()
        return {
            url:'/api/resource/upload',
            headers:{
                'request-userid':session.userid,
                'request-appid':0,
                'request-token':hex_md5(session.token+time),
                'request-time':time
            }
        }},
    loadResources:(type,page,pagesize,countdata,headers) => api.get(`/resource/loadresources?type=`+type+`&page=`+page+'&pagesize='+pagesize+'&countdata='+countdata+`&time=`+Date.now(),headers),
    postResource:(data,headers)=>api.post('/resource/postresource',data,headers),
    resourceStatus:(id,status,headers)=>api.post('/resource/changestatus',{id:id,status:status},headers),

    //setting
    userPost:(data,headers)=>api.post('/setting/user',data,headers),
    userGet:(id,headers)=>api.get('/setting/user?id='+id,headers),
    userDelete:(id,headers)=>api.delete('/setting/user?id='+id,headers),
    userPut:(data,headers) => api.put('/setting/user',data,headers),
    
    menuPost:(data,headers)=>api.post('/setting/menu',data,headers),
    menuGet:(id,headers)=>api.get('/setting/menu?id='+id,headers),
    menuDelete:(id,headers)=>api.delete('/setting/menu?id='+id,headers),
    menuPut:(data,headers) => api.put('/setting/menu',data,headers),

    rolePost:(data,headers)=>api.post('/setting/role',data,headers),
    roleGet:(id,headers)=>api.get('/setting/role?id='+id,headers),
    roleDelete:(id,headers)=>api.delete('/setting/role?id='+id,headers),
    rolePut:(data,headers) => api.put('/setting/role',data,headers),
    
    userrolePost:(data,headers)=>api.post('/setting/userrole',data,headers),
    userroleGet:(user_id,headers)=>api.get('/setting/userrole?user_id='+user_id,headers),
    roleuserGet:(role_id,headers)=>api.get('/setting/userrole?role_id='+role_id,headers),
    userroleDelete:(id,headers)=>api.delete('/setting/userrole?id='+id,headers),
    userrolePut:(data,headers) => api.put('/setting/userrole',data,headers),
    
    roleauthPost:(data,headers)=>api.post('/setting/roleauth',data,headers),
    roleauthGet:(id,headers)=>api.get('/setting/roleauth?id='+id,headers),
    roleauthDelete:(id,headers)=>api.delete('/setting/roleauth?id='+id,headers),
    roleauthPut:(data,headers) => api.put('/setting/roleauth',data,headers),
    
    balancePost:(data,headers)=>api.post('/setting/balance',data,headers),
    balanceGet:(id,headers)=>api.get('/setting/balance?id='+id,headers),
    balanceDelete:(id,headers)=>api.delete('/setting/balance?id='+id,headers),
    balancePut:(data,headers) => api.put('/setting/balance',data,headers),

    areaPost:(data,headers)=>api.post('/setting/area',data,headers),
    areaGet:(id,headers)=>api.get('/setting/area?id='+id,headers),
    areaDelete:(id,headers)=>api.delete('/setting/area?id='+id,headers),
    areaPut:(data,headers) => api.put('/setting/area',data,headers),

    courses:(headers)=>api.get('/lesson/courses',headers),
    courseGet:(id,lesson,headers)=>api.get('/lesson/course?id='+id+(lesson?('&lesson='+lesson):''),headers),
    coursePost:(data,headers)=>api.post('/lesson/course',data,headers),
    coursePut:(data,headers)=>api.put('/lesson/course',data,headers),
    courseDelete:(id,headers)=>api.delete('/lesson/course?id='+id,headers),
    lessonGet:(id,content,headers)=>api.get('/lesson/lesson?id='+id+(content?('&content='+content):''),headers),
    lessonPost:(data,headers)=>api.post('/lesson/lesson',data,headers),
    lessonPut:(data,headers)=>api.put('/lesson/lesson',data,headers),
    lessonDelete:(id,headers)=>api.delete('/lesson/lesson?id='+id,headers),
    
    lessonpagePost:(data,headers)=>api.post('/lesson/lessonpage',data,headers),
    lessonpagePut:(data,headers)=>api.put('/lesson/lessonpage',data,headers),
    lessonpageDelete:(id,headers)=>api.delete('/lesson/lessonpage?id='+id,headers),
}

export default apis
