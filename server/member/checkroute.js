
// const { validationResult } = require("express-validator")
// const { returnError } = require("../components/errcode")
// const UserCtrl = require("./controllers/UserCtrl")
// const EventCtrl = require("./controllers/EventCtrl")
// const MemberCtrl = require("./controllers/MemberCtrl")
// const HomeCtrl = require("./controllers/HomeCtrl")
// const actionMap = {
//     user: {
//         register:UserCtrl.register,
//         sendcode:UserCtrl.sendcode,
//         sendcode1:UserCtrl.sendcode1,
//         verifycode:UserCtrl.verifycode,
//         resetpwd:UserCtrl.resetpwd,
//         login:UserCtrl.login,
//     },
//     event:{
//         getevent:EventCtrl.getEvent,
//         applyevent:EventCtrl.applyEvent,
//         payevent:EventCtrl.payEvent,
//         photo:EventCtrl.photo,
//         setuppay:EventCtrl.setupPay,
//         paycallback:EventCtrl.payCallback,
//         loadapplicants:EventCtrl.loadApplicantsList
//     },
//     member:{
//         editmember:MemberCtrl.editMember,
//         loadtransactions:MemberCtrl.loadTransactions,
//         loadschedule:MemberCtrl.loadSchedule,
//         loadschedules:MemberCtrl.loadSchedules,
//     },
//     home:{
//         loadresources:HomeCtrl.loadResources,
//         photo:HomeCtrl.photo,
//     }
// }
// const getValidatorErrorResult = (errors)=>{
//     for(let i in errors) {
//         let err = errors[i]
//         if(err.param == "_error") {
//             let pp = false
//             let pa = []
//             for(let j in err.nestedErrors) {
//                 let err1 = err.nestedErrors[j]
//                 pa.push(err1.param)
//                 if(err1.value) {
//                     pp = true
//                     err.param = err1.param
//                     err.value = err1.value
//                     err.msg = err1.msg
//                     break
//                 }
//             }
//             if(!pp) {
//                 err.param = pa
//                 err.value = 'no value'
//                 err.msg = 'no value'
//             }
//         }
//     }
//     return {success:false,data:{errcode:990000,errors:errors}}
// }
// module.exports.checkValidateRouter = (req,res) => {    
//     const errors = validationResult(req); 
//     if (!errors.isEmpty()) {
//         return res.status(209).json(getValidatorErrorResult(errors.array()));
//     }    
//     return actionMap[req.req_component]? (
//                 actionMap[req.req_component][req.req_action]?
//                     actionMap[req.req_component][req.req_action](req,res):
//                     returnError(res,900000)
//                 ):returnError(res,900000)
// }