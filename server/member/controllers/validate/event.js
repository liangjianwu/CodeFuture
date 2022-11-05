const { body, query, oneOf } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {       
        case 'getevent':{
            return [
                query('code','code is invalid').exists().notEmpty().isString().isLength({min:6,max:6}),
                query('applyid').optional().isInt({min:1}),
                query('token').optional().isMD5(),
                query('time').optional().isInt({min:1})
            ]
        }
        case 'applyevent':{
            return [
                body('code','code is invalid').optional().isString().isLength({min:6,max:6}),
                body('id','id is invalid').exists().isInt({min:0}),
                body('form').exists().isString().isLength({min:3}),
                body('event_id').exists().isInt({min:1}),
            ]
        }
        case 'setuppay':{
            return [
                body('code','code is invalid').exists().isString().isLength({min:6,max:6}),
                body('id','id is invalid').exists().isInt({min:0}),                
            ]
        }
        case 'payevent':{
            return [
                body('code','code is invalid').optional().isString().isLength({min:6,max:6}),
                body('id','id is invalid').exists().isInt({min:0}),
                body('order').exists().isString().isLength({min:3,max:32}),
                body('event_id').exists().isInt({min:1}),
                body('amount').exists().isNumeric({min:0}),
            ]
        }
        case 'paycallback':{
            return [
                query('applyid').exists().isInt({min:1}),
                query('token').exists().isMD5(),
                query('time').exists().isInt(),
                query('payment_intent').optional().isString().isLength({min:24,max:32}),
            ]
        }
        case 'photo': {
            return [
                query('file').exists().isString().isLength({min:17,max:20})
            ]
        }
        case 'loadapplicants':{
            return [
                query('code','code is invalid').exists().isString().isLength({min:6,max:6}),                               
            ]
        }
    }
}