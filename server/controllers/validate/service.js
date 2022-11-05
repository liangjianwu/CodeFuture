const { body,query,oneOf } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'addcompany':{
            return [                
                body('name').exists().notEmpty().isLength({min:3,max:64}),
            ]
        }
        case 'joincompany':{
            return [                
                body('token').exists().notEmpty().isLength({min:6,max:6}),
            ]
        }
        case 'applyservice':{
            return [                
                body('appid').exists().notEmpty().isInt({min:0})
            ]
        }
    }
}