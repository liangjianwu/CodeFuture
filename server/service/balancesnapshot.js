const AccountingCtrl = require('../controllers/AccountingCtrl')

async function main() {
    await AccountingCtrl.snapshotBalanceForService()
    return
}
main().catch(e=>{
    ErrorHint(e)
})