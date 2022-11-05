const { body,query,oneOf } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'loadresources':{
            return [
                query('type').exists().isIn(['gallery','event','course']),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:2}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('resource_type').exists().isIn(['video','img']),
            ]
        }
        case 'photo': {
            return [
                query('file').exists().isString().isLength({min:17,max:20})
            ]
        }
    }
}