const {ErrorHint} = require('./console')

const ReturnMsg = {
    msg100000:'Processed successfully',
    msg100001:'Verification code has been sent successfully',
    msg100002:'Code verification succeeded',
    msg100003:'Password reset successful',
    msg100061:'Updated successfully',
}
const ErrorMsg = {
    err900000:'Bad request',
    err900001:'Exception, failed to operate data',
    err900002:'Session is invalid, please login again',        
    err900005:'Exception, failed to find ua data',
    err900003:'Session is timeout',
    err900004:'Need to login',
    err900005:'Failed to create the company', 
    err900006:'Failed to create the data object',     
    err900007:'Duplicate data exists',     
    err900008:'Requestion was refused',
    err900009:'Requestion is not in checklist',
    err900010:'There is no default role in system',
    
    //servicectrl
    err910001:'Exception, failed to load menu',
    err910002:'Exception, failed to load services',
    err910003:'You have not register company or business yet',
    err910004:'Failed to find the service',
    err910005:'Just super admin can apply a service',
    err910006:'The data does not exist',
    //upload
    err920001:'File should be excel file that the suffix is "xls" or "xlsx"',
    err920002:'Failed to save the file',
    err920003:'Exception, failed to load mu data',
    err920004:'Exception, failed to load mg data',
    err920005:'File should be image file that the suffix is "jpg" or "png" or "jpeg"',
    //register
    err100001:'The email has been used',
    err190001:'Exception, failed to create authorization data',
    err190002:'Exception, failed to create account', 
    //sendcode
    err191001:'Exception, failed to create uv data',
    err191002:'Exception, failed to update uv data',
    err191003:'Exception, failed to find user data',
    err100011:'The account does not exist',
    //verifycode
    err190021:'Exception, failed to update user data',
    err190022:'Exception, failed to find user data',
    err190023:'Exception, failed to find uv data',
    err190024:'Exception, failed to update uv data',
    err100021:'Code verification failed',
    err100022:'The code has expired',
    err100023:'The code is invalid',        
    //resetpwd
    err190031:'Exception, failed to update user data',
    err190032:'Exception, failed to find user data',
    err190033:'Exception, failed to find uv data',    
    err190034:'Exception, failed to update data',    
    err190035:'Your password has not been changed!',
    err100032:'The code has expired',
    err100033:'The code is invalid', 
    //login
    err190041:'Exception, failed to create uv data',
    err190042:'Exception, failed to update uv data',    
    err190043:'Exception, failed to find user data',    
    err100041:'Account does not exist or password is wrong',
    //logout
    err100051:'Exception, failed to logout',
    //profile
    err100061:'Your profile does not exists',
    err100062:'Your account does not exists',
    err190061:'Exception, failed to find user data',
    err190062:'Exception, failed to find user profile',
    err100063:'Failed to update profile',

    //add company
    err200001:"You can't be in two companies at the same time",
    err200002:'Exception, failed to add user to the company',
    err200003:'Exception, failed to create company',
    err200004:'Exception, failed to find mu data',
    err200005:'Exception, failed to find up data',
    err200006:'Exception, failed to create company,try to join the company',
    

    //loadCustomer
    err300001:'Failed to load user data',
    err300002:'Failed to update member inforation',
    //getmember
    err300003:'Failed to load member information',
    //addGroup
    err300004:'The group already exists',
    err300005:'Failed to get mu data',
    //addToGroup
    err300006:'Some member or group do not belong to you',
    //removeFromGroup
    err300007:'The group does not exist!',

    //member
    //recharge
    err400001:'Balance type is invalid',
    err400002:'No balance to charge',
    err400003:'No enough balance to charge',
    err400004:'Someone has not enough balance to charge',
    err400005:'Failed to charge',
    err400006:'You can not recharge the member',
    err400007:'You can not charge someone,perhaps they are not your members',
    

    //refund
    err400008:'The original record does not exist',
    err400009:'Refund too much',
    err400010:'The amount is invalid',
    err400011:'The member balance does not exist',
    err400012:"The member's balance is not enough to refund",
    err400013:"Failed to update member's balance",
    err400014:"You can't refund the member",
    err400015:"you can not edit it",
    err400017:"The order has been refund,you can not edit it",
    err400016:'The product is invalid',
    //cancel
    err400018:'Failed to cancel transaction',
    err400019:'You can not cancel transaction',
    //emailctrl
    //edittemplate
    err500001:"Failed to find the template",
    err500002:"Failed to find the task",
    err500003:"Can't edit the task because the task has been executed",
    
    //eventctrl
    //getevent
    err600001:"Failed to find the event",
    err610001:"The event does not exist",
    err610002:"Failed to apply the event",
    err610003:"Expired to apply the event",
    err610004:"Too early to apply the event",
    err610005:'You have paid for the event',
    err610006:'Failed to verify token',
    
    //member client
    err700001:'Failed to update the data',
    err700002:'Failed to find merchant code',

    err800001:'The schedule does not exists',

    //pay
    
}

const errorMsg = (code,msg)=>{
    if(!msg && !ErrorMsg['err'+code]) {
        ErrorHint("Error code: "+ code + " is indefined")
        return {success:false,data:ReturnMsg['err' + 900000]};
    }
    return {success:false,data:{errcode:code,error:msg?msg:ErrorMsg['err'+code]}};
}
const successMsg = (code,msg)=>{
    if(!ReturnMsg['msg'+code]) {
        ErrorHint("Message code: "+ code + " is indefined")
        return {success:true,data:ReturnMsg['msg' + 100000]};
    }
    return {success:true,data:msg?msg:ReturnMsg['msg'+code]};
}
module.exports.getErrorMessage = (code) => {
    return ErrorMsg['err' + code]
}
module.exports.getMessage = (code) => {
    return ReturnMsg['msg' + code]
}
module.exports.returnError = (res,code,msg) => {
    return res.status(209).json(errorMsg(code,msg))
}
module.exports.returnSuccess = (res,code,msg)=>{
    return res.status(200).json(successMsg(code,msg))
}
module.exports.returnResult = (res,data)=>{
    return res.status(200).json(successMsg(100000,data))
}