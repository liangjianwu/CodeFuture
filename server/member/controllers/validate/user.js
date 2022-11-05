const { body,query,oneOf } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'register': {    
            return [ 
                body('firstname','2~32 letters').exists().notEmpty().isString().isLength({min:2,max:32}),
                body('lastname','2~32 letters').exists().notEmpty().isString().isLength({min:2,max:32}),
                body('phone','This phone is invalid').exists().notEmpty().isMobilePhone(),
                body('email','This email is invalid').exists().notEmpty().isEmail(),                
                body('passwd').exists().notEmpty().isAlphanumeric().isLength({min:16,max:32}).isMD5(),
            ]   
        }
        case 'sendcode': {            
            return [ 
                body('action').exists().notEmpty().isIn(['register','resetpwd']),
            ]
        }
        case 'sendcode1': {            
            return [ 
                body('email','This email is invalid').exists().notEmpty().isEmail(),
                body('action').exists().notEmpty().isIn(['register','resetpwd']),
            ]
        }
        case 'verifycode': {            
            return [                 
                body('action').exists().isIn(['register','resetpwd']),
                body('code').exists().isString().isLength({min:6,max:7}),
            ]
        }
        case 'resetpwd':{
            return [
                body('email','This email is invalid').exists().notEmpty().isEmail(),                
                body('code','6 digit number').exists().isString().isLength({min:6,max:6}),
                body('passwd').exists().isLength({min:16,max:32}).isMD5()
            ]
        }
        case 'login':{
            return [                
                body('email','This email is invalid').exists().notEmpty().isEmail(),
                body('passwd').exists().notEmpty().isMD5(),
            ]
        }
        
    }
}