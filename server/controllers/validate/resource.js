const { body,query,oneOf } = require('express-validator/check')

exports.validate = (method) => {
    switch (method) {
        case 'postresource': {    
            return [ 
                body('id').exists().isInt({min:0}),
                body('name').exists().isString().isLength({min:0,max:45}),
                body('description').optional().isString().isLength({max:256}),
                body('path').exists().isString().isLength({min:0,max:128}),
                body('type').optional().isIn(['gallery','event','course']),
                body('resource_type').optional().isIn(['img','video']),
                body('islocal').optional().isIn([0,1]),                
            ]   
        }
        case 'changestatus': {
            return [
                body('id').exists().isInt({min:1}),
                body('status').exists().isIn([0,1]),
            ]
        }
        case 'loadresources':{
            return [
                query('type').exists().isIn(['gallery','event','course']),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'photo': {
            return [
                query('file').exists().isString().isLength({min:17,max:20})
            ]
        }
    }
}