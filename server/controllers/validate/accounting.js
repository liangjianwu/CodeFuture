const { body, query, oneOf } = require('express-validator')

exports.validate = (method) => {
    switch (method) {       
        case 'loadmembers':{
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'loadfamilys':{
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('orderfield').exists().isString().isLength({min:2,max:16}),
                query('order').exists().isIn(['desc','asc']),
                //query('type').optional().isIn(['privateclass','groupclass']),
            ]
        }
        case 'balancesnapshot':{
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('orderfield').exists().isString().isLength({min:2,max:16}),
                query('order').exists().isIn(['desc','asc']),
                query('type').optional().isIn(['privateclass','groupclass']),
                query('snap_date').exists().isDate(),
            ]
        }
        case 'edittransaction': {
            return [
                body('id').exists().isInt({min:1}),
                body('invoice').optional().isString().isLength({min:0,max:32}),
                body('note').optional().isString().isLength({min:0,max:128}),
                body('order_date').optional().isDate(),
                body('peoples').optional().isInt({min:1})
            ]
        }
        case 'recharge':{
            return [
                body('amount','The amount should be 0~10000').exists().notEmpty().isDecimal({min:0.01,max:10000}),
                body('customerid').exists().notEmpty().isInt({min:0}),
                body('familyid').exists().notEmpty().isInt({min:0}),
                body('type').exists().notEmpty().isString().isLength({min:1,max:16}),
                body('note').optional().isString().isLength({min:0,max:128}),
                body('invoice').optional().isString().isLength({min:0,max:32}),
                body('date').exists().isDate(),
            ]
        }
        case 'userbalance.post':{
            return [
                body('amount','The amount should be 0~10000').exists().notEmpty().isDecimal({min:0.01,max:10000}),
                body('customerid').exists().notEmpty().isInt({min:0}),
                body('familyid').exists().notEmpty().isInt({min:0}),
                body('balance_typeid').exists().notEmpty().isInt({min:1}),
                body('note').optional().isString().isLength({min:0,max:128}),
                body('invoice').optional().isString().isLength({min:0,max:32}),
                body('date').exists().isDate(),
            ]
        }
        case 'charge':{
            return [
                body('amount','The amount should be 0~3000').exists().notEmpty().isDecimal({min:0.01,max:3000}),
                body('customers').exists().notEmpty().isArray({min:1}).custom(a=>{
                    return a.every((e) => {
                        if (!isNaN(e) && Number(e) > 0) {
                            return true;
                        } else return false;
                    })
                }),
                body('note').optional().isString().isLength({min:0,max:128}),                
                body('product_id').exists().isInt({min:0}),
                body('count').exists().isInt({min:0}),
                body('peoples').exists().isInt({min:1}),
                body('date').exists().isDate(),
                body('transaction_id').exists().isInt({min:0}),
            ]
        }
        case 'refund':{
            return [
                body('amount','The amount should be 0~3000').exists().notEmpty().isDecimal({min:0.01,max:20000}),                
                body('note').optional().isString().isLength({min:0,max:128}),
                body('refer').exists().notEmpty().isInt({min:1}),
                body('date').exists().isDate(),
            ]
        }
        case 'canceltransaction':{
            return [
                body('id').exists().notEmpty().isInt({min:1}),
            ]
        }
        case 'getgroupmembers': {
            return [
                query('id').exists().notEmpty().isString(),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'getreport':{
            return [                
                query('from').exists().notEmpty().isDate(),
                query('to').exists().notEmpty().isDate(),
                query('orderfield').optional().isString().isLength({min:2,max:16}),
                query('order').optional().isIn(['desc','asc']),
            ]
        }
        case 'searchmember':{
            return [
                query('value','The search value should be name or email or phone').exists().notEmpty().isString().isLength({min:3,max:48}),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'searchfamily':{
            return [
                query('value','The search value should be name or email or phone').exists().notEmpty().isString().isLength({min:3,max:48}),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'loadtransactions':{
            return [
                query('fid').exists().notEmpty().isInt({min:0}),
                query('kid').exists().notEmpty().isInt({min:0}),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('orderfield').exists().isString().isLength({min:2,max:16}),
                query('order').exists().isIn(['desc','asc']),
                query('coache').exists().isInt({min:0}),
                query('product').exists().isInt({min:0}),
                query('from').exists().notEmpty().isDate(),
                query('to').exists().notEmpty().isDate(),
            ]
        }
        case 'gettransaction':{
            return [
                body('id').exists().notEmpty().isInt({min:1})
            ]
        }
        default: {
            return undefined
        }
    }
}