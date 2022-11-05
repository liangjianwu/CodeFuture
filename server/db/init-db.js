const { ErrorHint } = require('../components/console.js');
const { CrmMenu } = require('../configs/CrmMenu.js');
const model = require('./model.js');
// model.sync();

// console.log('init db ok.');

// const MerchantUser = model.MerchantUser
// const UserRole = model.UserRole
// const Role = model.Role
// const App = model.App
// const RoleAuth = model.RoleAuth
// const MerchantProfile = model.MerchantProfile
// const User = model.User
// const UserProfile = model.UserProfile
// try {
//     await Role.create({merchant_id:0,app_id:0,name:'admin',status:1})
//     await Role.update({status:0})
//     await App.create({name:'CRM',code:'crm',description:'Crm system',authtree:JSON.stringify(CrmMenu),status:1})
// }catch(e) {
//     ErrorHint(e)
// }



process.exit(0);