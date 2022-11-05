const { body,query,oneOf } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'editmember': {    
            return [ 
                body('id').optional().isInt({min:0}),                
                body('firstname').exists().isString().isLength({min:2,max:32}),
                body('lastname').exists().isString().isLength({min:2,max:32}),
                body('email').optional().isEmail(),
                body('phone').optional().isMobilePhone(),
                body('gender').optional().isIn(['Male','Female','Other']),
                body('birthday').optional().isDate(),
            ]   
        }
        case 'loadtransactions':{
            return [
                query('bid').optional().isInt({min:0}),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:2}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'loadschedule': {
            return [
                query('from').optional().isInt({min:0}),
            ]
        }
        case 'loadschedules': {
            return [
                query('from').optional().isInt({min:0}),
            ]
        }
    }
}