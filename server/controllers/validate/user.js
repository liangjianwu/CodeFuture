const { body,query,oneOf } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'register': {    
            return [ 
                body('email').exists().notEmpty().isEmail(),                
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
                body('email').exists().notEmpty().isEmail(),
                body('action').exists().notEmpty().isIn(['register','resetpwd']),
            ]
        }
        case 'verifycode': {            
            return [                 
                body('action').exists().isIn(['register','resetpwd']),
                body('code').exists().isLength({min:6,max:6}).isNumeric(),
            ]
        }
        case 'auth': {
            return [
                body('userid').exists().isInt({min:0}),
                body('token').exists().notEmpty().isMD5(),
                body('appid').exists().notEmpty().isString().isLength({min:3,max:32}),
            ]
        }
        case 'ssoauth': {
            return [
                query('userid').exists().isInt({min:0}),
                query('token').exists().notEmpty().isMD5(),
                query('appid').exists().notEmpty().isString().isLength({min:3,max:32}),
                query('toappid').exists().notEmpty().isString().isLength({min:3,max:32}),
                query('apptime').exists().notEmpty().isInt({min:0}),
            ]
        }
        case 'resetpwd':{
            return [
                body('email').exists().notEmpty().isEmail(),                
                body('code').exists().isLength({min:6,max:6}).isNumeric(),
                body('passwd').exists().isLength({min:16,max:32}).isMD5()
            ]
        }
        case 'login':{
            return [                
                body('email').exists().notEmpty().isEmail(),
                body('passwd').exists().notEmpty().isMD5(),
            ]
        }
        case 'coachlogin':{
            return [                
                body('email').exists().notEmpty().isEmail(),
                body('passwd').exists().notEmpty().isMD5(),
            ]
        }
        case 'profile.post':{
            return [
                body('firstname').optional().isString().isLength({min:2,max:32}),
                body('lastname').optional().isString().isLength({min:2,max:32}),                
                body('gender').optional().isInt({min:0,max:2}),
                body('country').optional().isString().isLength({min:3,max:32}),                
                body('phone').optional().isString().isMobilePhone(),
                body('province').optional().isString().isLength({min:2,max:32}),                
                body('city').optional().isString().isLength({min:2,max:32}),                
                body('address').optional().isString().isLength({min:5,max:64}), 
                body('postcode').optional().isString().isLength({min:5,max:8}), 
            ]
        }
        case 'profile.put':{
            return [
                
                body('firstname').optional().isString().isLength({min:2,max:32}),
                body('lastname').optional().isString().isLength({min:2,max:32}),                
                body('gender').optional().isInt({min:0,max:2}),
                body('country').optional().isString().isLength({min:3,max:32}),                
                body('phone').optional().isString().isMobilePhone(),
                body('province').optional().isString().isLength({min:2,max:32}),                
                body('city').optional().isString().isLength({min:2,max:32}),                
                body('address').optional().isString().isLength({min:5,max:64}), 
                body('postcode').optional().isString().isLength({min:5,max:8}), 
            ]
        }
        case 'addcompany':{
            return [                
                body('name').exists().notEmpty().isLength({min:3,max:64}),
            ]
        }
        // case 'getprofile': {
        //     return [
        //         query('fields').customSanitizer(val=>{
        //             return ('id,'+val).split(',')
        //         }).custom(fields=>{
        //             for(let f in fields) {
        //                 if(['id','firstname','lastname','middlename','gender','country','province','city','address','postcode'].indexOf(fields[f]) < 0) {
        //                     throw new Error(fields[f] + ' is an unvalid field')
        //                 }
        //             }
        //             return true
        //         })
        //     ]
        // }
    }
}