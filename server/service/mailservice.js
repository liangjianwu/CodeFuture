const { ErrorHint, Debug } = require('../components');
const EmailService = require('./mail')
const TaskService = require('./task')
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
async function main() {
    while(true) {        
        await EmailService.clearVerifyEmail()
        await EmailService.clearUserVerifyEmail()
        await TaskService.taskToEmailQueue()
        let ret = await EmailService.checkAndSendEmail()
        ret.date = new Date()
        //Debug(ret)        
        await sleep(3000);
    }
}
main().catch(e=>{
    ErrorHint(e)
})