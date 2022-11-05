// const express = require('express')

// const CheckRouter = require("./checkroute")
// const UserValidate = require('../controllers/validate/user')
// const MemberValidate = require('../controllers/validate/member')
// const ServiceValidate = require('../controllers/validate/service')
// const AccountingValidate = require('../controllers/validate/accounting')
// const ProductValidate = require('../controllers/validate/product')
// const EmailValidate = require('../controllers/validate/email')
// const EventValidate = require('../controllers/validate/event')
// const CoachValidate = require('../controllers/validate/coach')
// const ResourceValidate = require('../controllers/validate/resource')
// const UserCtrl = require("../controllers/UserCtrl")
// const ServiceCtrl = require("../controllers/ServiceCtrl")
// const MembereCtrl = require('../controllers/MemberCtrl')
// const AccountingCtrl = require('../controllers/AccountingCtrl')
// const ProductCtrl = require('../controllers/ProductCtrl')
// const UploadCtrl = require('../controllers/UploadCtrl')
// const EmailCtrl = require('../controllers/EmailCtrl')
// const EventCtrl = require('../controllers/EventCtrl')
// const CoachCtrl = require('../controllers/CoachCtrl')
// const ResourceCtrl = require('../controllers/ResourceCtrl')
// const userRouter = express.Router()
// userRouter.post('/register', UserValidate.validate('register'), CheckRouter.checkValidateRouter)
// userRouter.post('/sendcode',UserValidate.validate('sendcode'),CheckRouter.checkValidateRouter)
// userRouter.post('/sendcode1',UserValidate.validate('sendcode1'),CheckRouter.checkValidateRouter)
// userRouter.post('/verifycode',UserValidate.validate('verifycode'),CheckRouter.checkValidateRouter)
// userRouter.post('/resetpwd',UserValidate.validate('resetpwd'),CheckRouter.checkValidateRouter)
// userRouter.post('/login',UserValidate.validate('login'),CheckRouter.checkValidateRouter)
// userRouter.post('/coachlogin',UserValidate.validate('coachlogin'),CheckRouter.checkValidateRouter)
// userRouter.get('/signout',UserCtrl.logout)
// userRouter.post('/auth',UserValidate.validate('auth'),CheckRouter.checkValidateRouter)
// userRouter.get('/ssoauth',UserValidate.validate('ssoauth'),CheckRouter.checkValidateRouter)
// userRouter.get('/profile',UserCtrl.getprofile)
// userRouter.post('/profile',UserValidate.validate('profile'),CheckRouter.checkValidateRouter)

// const ServiceRouter = express.Router()
// ServiceRouter.get(`/loginload`,ServiceCtrl.loginLoad)
// ServiceRouter.get(`/merchant`,ServiceCtrl.merchant)
// ServiceRouter.get(`/merchantpwd`,ServiceCtrl.merchantpwd)
// ServiceRouter.post(`/addcompany`,ServiceValidate.validate('addcompany'),CheckRouter.checkValidateRouter)
// ServiceRouter.post(`/joincompany`,ServiceValidate.validate('joincompany'),CheckRouter.checkValidateRouter)

// const MemberRouter = express.Router()
// MemberRouter.get(`/loginload`,MembereCtrl.loginLoad)
// MemberRouter.post(`/editcustomer`,MemberValidate.validate('customer.edit'),CheckRouter.checkValidateRouter)
// MemberRouter.get(`/loadcustomer`,MemberValidate.validate('loadcustomer'),CheckRouter.checkValidateRouter)
// MemberRouter.get(`/loaduser`,MemberValidate.validate('loaduser'),CheckRouter.checkValidateRouter)
// MemberRouter.post(`/edituser`,MemberValidate.validate('edituser'),CheckRouter.checkValidateRouter)
// MemberRouter.get(`/getcustomer`,MemberValidate.validate('customer.load'),CheckRouter.checkValidateRouter)
// MemberRouter.get(`/getgroups`,MembereCtrl.getGroups)
// MemberRouter.post(`/creategroup`,MemberValidate.validate('group.create'),CheckRouter.checkValidateRouter)
// MemberRouter.get(`/getgroupcustomers`,MemberValidate.validate('getgroupcustomers'),CheckRouter.checkValidateRouter)
// MemberRouter.post(`/addtogroup`,MemberValidate.validate('addtogroup'),CheckRouter.checkValidateRouter)
// MemberRouter.get(`/searchcustomer`,MemberValidate.validate('searchcustomer'),CheckRouter.checkValidateRouter)
// MemberRouter.get(`/searchuser`,MemberValidate.validate('searchuser'),CheckRouter.checkValidateRouter)
// MemberRouter.post(`/removefromgroup`,MemberValidate.validate('removefromgroup'),CheckRouter.checkValidateRouter)
// MemberRouter.get(`/getmemberinfostruct`,MembereCtrl.getMemberInfoStruct)
// MemberRouter.post(`/setmemberinfostruct`,MemberValidate.validate('setmemberinfostruct'),CheckRouter.checkValidateRouter)
// MemberRouter.post(`/changeuserstatus`,MemberValidate.validate('changeuserstatus'),CheckRouter.checkValidateRouter)
// MemberRouter.post(`/changememberstatus`,MemberValidate.validate('changememberstatus'),CheckRouter.checkValidateRouter)
// MemberRouter.post(`/changememberlevel`,MemberValidate.validate('changememberlevel'),CheckRouter.checkValidateRouter)
// const AccountingRouter = express.Router()
// AccountingRouter.get(`/loginload`,AccountingCtrl.loginLoad)
// AccountingRouter.get(`/loadmembers`,AccountingValidate.validate('loadmembers'),CheckRouter.checkValidateRouter)
// AccountingRouter.get(`/loadfamilys`,AccountingValidate.validate('loadfamilys'),CheckRouter.checkValidateRouter)
// AccountingRouter.get(`/snapshotbalance`,AccountingCtrl.snapshotBalance)
// AccountingRouter.get(`/balancesnapshot`,AccountingValidate.validate('balancesnapshot'),CheckRouter.checkValidateRouter)
// AccountingRouter.post(`/recharge`,AccountingValidate.validate('recharge'),CheckRouter.checkValidateRouter)
// AccountingRouter.post(`/charge`,AccountingValidate.validate('charge'),CheckRouter.checkValidateRouter)
// AccountingRouter.get(`/searchmember`,AccountingValidate.validate('searchmember'),CheckRouter.checkValidateRouter)
// AccountingRouter.get(`/searchfamily`,AccountingValidate.validate('searchfamily'),CheckRouter.checkValidateRouter)
// AccountingRouter.get(`/getgroupmembers`,AccountingValidate.validate('getgroupmembers'),CheckRouter.checkValidateRouter)
// AccountingRouter.get(`/loadtransactions`,AccountingValidate.validate('loadtransactions'),CheckRouter.checkValidateRouter)
// AccountingRouter.post(`/refund`,AccountingValidate.validate('refund'),CheckRouter.checkValidateRouter)
// AccountingRouter.post(`/gettransaction`,AccountingValidate.validate('gettransaction'),CheckRouter.checkValidateRouter)
// AccountingRouter.post(`/canceltransaction`,AccountingValidate.validate('canceltransaction'),CheckRouter.checkValidateRouter)
// AccountingRouter.get(`/getreport`,AccountingValidate.validate('getreport'),CheckRouter.checkValidateRouter)
// AccountingRouter.post('/edittransaction',AccountingValidate.validate('edittransaction'),CheckRouter.checkValidateRouter)

// const ProductRouter = express.Router()
// ProductRouter.get(`/loadproducts`,ProductCtrl.loadProducts)
// ProductRouter.post(`/editproduct`,ProductValidate.validate('editproduct'),CheckRouter.checkValidateRouter)
// ProductRouter.post(`/removeproduct`,ProductValidate.validate('removeproduct'),CheckRouter.checkValidateRouter)

// const UploadRouter = express.Router()
// UploadRouter.post(`/customersfile`,UploadCtrl.uploadMemberFiles)

// const EmailRouter = express.Router()
// EmailRouter.get(`/loginload`,EmailCtrl.loginLoad)
// EmailRouter.post('/edittemplate',EmailValidate.validate('edittemplate'),CheckRouter.checkValidateRouter)
// EmailRouter.get('/gettemplate',EmailValidate.validate('gettemplate'),CheckRouter.checkValidateRouter)
// EmailRouter.get('/loadtemplates',EmailCtrl.loadTemplates)
// EmailRouter.post(`/removetemplate`,EmailValidate.validate('removetemplate'),CheckRouter.checkValidateRouter)
// EmailRouter.post(`/clonetemplate`,EmailValidate.validate('clonetemplate'),CheckRouter.checkValidateRouter)
// EmailRouter.get('/gethouse',EmailValidate.validate('gethouse'),CheckRouter.checkValidateRouter)
// EmailRouter.post(`/edittask`,EmailValidate.validate('edittask'),CheckRouter.checkValidateRouter)
// EmailRouter.get('/gettask',EmailValidate.validate('gettask'),CheckRouter.checkValidateRouter)
// EmailRouter.get('/loadtasks',EmailCtrl.loadTasks)
// EmailRouter.post(`/settaskstatus`,EmailValidate.validate('settaskstatus'),CheckRouter.checkValidateRouter)
// EmailRouter.get(`/loadtaskresult`,EmailValidate.validate('loadtaskresult'),CheckRouter.checkValidateRouter)

// const EventRouter = express.Router()
// EventRouter.get(`/loginload`,EventCtrl.loginLoad)
// EventRouter.post('/editevent',EventValidate.validate('editevent'),CheckRouter.checkValidateRouter)
// EventRouter.get('/getevent',EventValidate.validate('getevent'),CheckRouter.checkValidateRouter)
// EventRouter.get('/loadevents',EventCtrl.loadEvents)
// EventRouter.post(`/removeevent`,EventValidate.validate('removeevent'),CheckRouter.checkValidateRouter)
// EventRouter.post(`/cloneevent`,EventValidate.validate('cloneevent'),CheckRouter.checkValidateRouter)
// EventRouter.post(`/setstatus`,EventValidate.validate('setstatus'),CheckRouter.checkValidateRouter)
// EventRouter.post(`/setpublishstatus`,EventValidate.validate('setpublishstatus'),CheckRouter.checkValidateRouter)
// EventRouter.get('/loadapplicants',EventValidate.validate('loadapplicants'),CheckRouter.checkValidateRouter)

// const ResourceRouter = express.Router()
// ResourceRouter.post(`/upload`,ResourceCtrl.upload)
// ResourceRouter.post(`/postresource`,ResourceValidate.validate('postresource'),CheckRouter.checkValidateRouter)
// ResourceRouter.post(`/changestatus`,ResourceValidate.validate('changestatus'),CheckRouter.checkValidateRouter)
// ResourceRouter.get(`/loadresources`,ResourceValidate.validate('loadresources'),CheckRouter.checkValidateRouter)
// ResourceRouter.get(`/photo`,ResourceValidate.validate('photo'),CheckRouter.checkValidateRouter)
// const CoachRouter = express.Router()
// CoachRouter.post(`/editcoach`,CoachValidate.validate('editcoach'),CheckRouter.checkValidateRouter)
// CoachRouter.get(`/loadcoaches`,CoachCtrl.loadCoaches)
// CoachRouter.get(`/remove`,CoachValidate.validate('remove'),CheckRouter.checkValidateRouter)
// CoachRouter.get(`/loadcoachtime`,CoachValidate.validate('loadcoachtime'),CheckRouter.checkValidateRouter)
// CoachRouter.get(`/loadcoachrecord`,CoachValidate.validate('loadcoachrecord'),CheckRouter.checkValidateRouter)
// CoachRouter.get(`/loadschedule`,CoachValidate.validate('loadschedule'),CheckRouter.checkValidateRouter)
// CoachRouter.post(`/editschedule`,CoachValidate.validate('editschedule'),CheckRouter.checkValidateRouter)
// CoachRouter.post(`/addschedule`,CoachValidate.validate('addschedule'),CheckRouter.checkValidateRouter)
// CoachRouter.post(`/schedulestatus`,CoachValidate.validate('schedulestatus'),CheckRouter.checkValidateRouter)
// CoachRouter.post(`/deleteschedule`,CoachValidate.validate('deleteschedule'),CheckRouter.checkValidateRouter)


// module.exports = {userRouter,ServiceRouter,MemberRouter,UploadRouter,AccountingRouter,ProductRouter,EmailRouter,EventRouter,CoachRouter,ResourceRouter}