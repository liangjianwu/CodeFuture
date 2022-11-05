
const { validationResult } = require("express-validator")
const { returnError } = require("../components/errcode")
const UserCtrl = require("../controllers/UserCtrl")
const ServiceCtrl = require("../controllers/ServiceCtrl")
const MemberCtrl = require('../controllers/MemberCtrl')
const AccountingCtrl = require('../controllers/AccountingCtrl')
const ProductCtrl = require('../controllers/ProductCtrl')
const EmailCtrl = require('../controllers/EmailCtrl')
const EventCtrl = require('../controllers/EventCtrl')
const CoachCtrl = require('../controllers/CoachCtrl')
const ResourceCtrl = require('../controllers/ResourceCtrl')
const actionMap = {
    user: {
        register:UserCtrl.register,
        sendcode:UserCtrl.sendcode,
        sendcode1:UserCtrl.sendcode1,
        verifycode:UserCtrl.verifycode,
        resetpwd:UserCtrl.resetpwd,
        login:UserCtrl.login,
        coachlogin:UserCtrl.coachlogin,
        profile:UserCtrl.setprofile,
    },
    service:{
        loginload:ServiceCtrl.loginLoad,
        addcompany:ServiceCtrl.addcompany,
        joincompany:ServiceCtrl.joincompany,
        applyservice:ServiceCtrl.applyService,
    },
    member:{
        setmemberinfostruct:MemberCtrl.setMemberInfoStruct,
        loadcustomer:MemberCtrl.loadCustomer,
        loaduser:MemberCtrl.loadUser,
        edituser:MemberCtrl.editUserInfo,
        editcustomer:MemberCtrl.editCustomerInfo,
        getcustomer:MemberCtrl.getCustomer,
        getgroupcustomers:MemberCtrl.getGroupCustomers,
        creategroup:MemberCtrl.createGroup,
        addtogroup:MemberCtrl.addToGroup,
        searchcustomer:MemberCtrl.searchcustomer,
        searchuser:MemberCtrl.searchuser,
        removefromgroup:MemberCtrl.removeFromGroup,
        changeuserstatus:MemberCtrl.changeUserStatus,
        changememberstatus:MemberCtrl.changeMemberStatus,
        changememberlevel:MemberCtrl.changeMemberLevel,
    },
    accounting:{
        loadmembers:AccountingCtrl.loadMembers,
        loadfamilys:AccountingCtrl.loadFamilys,
        recharge:AccountingCtrl.recharge,
        charge:AccountingCtrl.charge,
        searchmember:AccountingCtrl.searchMembers,
        searchfamily:AccountingCtrl.searchFamilys,
        getgroupmembers:AccountingCtrl.getGroupMembers,
        loadtransactions:AccountingCtrl.loadtransactions,
        refund:AccountingCtrl.refund,
        canceltransaction:AccountingCtrl.cancelTransaction,
        gettransaction:AccountingCtrl.loadTransaction,
        getreport:AccountingCtrl.getReport,
        edittransaction:AccountingCtrl.editTransaction,
        balancesnapshot:AccountingCtrl.getBalanceSnapshot,
        snapshotbalance:AccountingCtrl.snapshotBalance,
    },
    product:{
        loadproducts:ProductCtrl.loadProducts,
        editproduct: ProductCtrl.editProduct,
        removeproduct:ProductCtrl.removeProduct,
    },
    email:{
        edittemplate:EmailCtrl.editTemplate,
        gettemplate:EmailCtrl.getTemplate,
        loadtemplates:EmailCtrl.loadTemplates,
        removetemplate:EmailCtrl.removeTemplate,
        clonetemplate:EmailCtrl.cloneTemplate,
        gethouse:EmailCtrl.loadHouse,
        edittask:EmailCtrl.editTask,
        loadtasks:EmailCtrl.loadTasks,
        gettask:EmailCtrl.getTask,
        settaskstatus:EmailCtrl.setTaskStatus,
        loadtaskresult:EmailCtrl.loadTaskResult,
    },
    event:{
        editevent:EventCtrl.editEvent,
        getevent:EventCtrl.getEvent,
        loadevents:EventCtrl.loadevents,
        removeevent:EventCtrl.removeEvent,
        cloneevent:EventCtrl.cloneEvent,
        setstatus:EventCtrl.setEventStatus,
        setpublishstatus:EventCtrl.setEventPublishStatus,
        loadapplicants:EventCtrl.loadApplicants,
    },
    coach:{
        editcoach:CoachCtrl.editCoach,
        remove:CoachCtrl.removeCoach,
        loadcoachtime:CoachCtrl.loadCoachClassTime,
        loadcoachrecord:CoachCtrl.loadCoachRecord,
        schedulestatus:CoachCtrl.scheduleStatus,
        loadschedule:CoachCtrl.loadSchedules,
        editschedule:CoachCtrl.editSchedule,
        addschedule:CoachCtrl.addSchedule,
        deleteschedule:CoachCtrl.deleteSchedule,
    },
    resource:{
        postresource:ResourceCtrl.postResource,
        changestatus:ResourceCtrl.changeStatus,
        loadresources:ResourceCtrl.loadResources,
        photo:ResourceCtrl.photo,
    }
}
const getValidatorErrorResult = (errors)=>{
    for(let i in errors) {
        let err = errors[i]
        if(err.param == "_error") {
            let pp = false
            let pa = []
            for(let j in err.nestedErrors) {
                let err1 = err.nestedErrors[j]
                pa.push(err1.param)
                if(err1.value) {
                    pp = true
                    err.param = err1.param
                    err.value = err1.value
                    err.msg = err1.msg
                    break
                }
            }
            if(!pp) {
                err.param = pa
                err.value = 'no value'
                err.msg = 'no value'
            }
        }
    }
    return {success:false,data:{errcode:990000,errors:errors}}
}
module.exports.checkValidateRouter = (req,res) => {    
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(209).json(getValidatorErrorResult(errors.array()));
    }    
    return actionMap[req.req_component]? (
                actionMap[req.req_component][req.req_action]?
                    actionMap[req.req_component][req.req_action](req,res):
                    returnError(res,900000)
                ):returnError(res,900000)
}