const { body, query, oneOf } = require('express-validator/check')
const { Debug } = require('../../components')

exports.validate = (method) => {
    switch (method) {       
        case 'loadevents':{
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'loadapplicants':{
            return [
                query('id').exists().notEmpty().isInt({min:1}),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'editevent':{
            return [
                body('id').optional().isInt({min:0}),
                body('name','max length is 45').exists().notEmpty().isString().isLength({min:2,max:45}),
                body('description','max length is 1024').optional().isLength({min:0,max:1024}),                                
                body('template','max length is 400k').exists().notEmpty().isString().isLength({min:0,max:409600}),    
                //body('pageurl','Url is invalid').optional().isURL().isLength({max:128}),
                body('begin','Begin date is invalid').optional().isDate(),
                body('end','End date is invalid').optional().isDate(),
                body('fee').optional().isNumeric({min:0}),
                body('pay').optional().isIn([0,1]),
                body('apply').optional().isIn([0,1,2]),
                body('sign').optional().isIn([0,1]),
                body('photo').optional().isString().isLength({min:0,max:32})
            ]
        }
        case 'getevent':{
            return [
                query('id').exists().notEmpty().isInt({min:1})
            ]
        }
        case 'removeevent':{
            return [
                body('id').exists().notEmpty().isInt({min:1})
            ]
        }
        case 'setstatus':{
            return [
                body('id').exists().notEmpty().isInt({min:1}),
                body('status').exists().notEmpty().isIn([1,2])
            ]
        }
        case 'setpublishstatus':{
            return [
                body('id').exists().notEmpty().isInt({min:1}),
                body('status').exists().notEmpty().isIn([0,1,2])
            ]
        }
        case 'cloneevent':{
            return [
                body('id').exists().notEmpty().isInt({min:1})
            ]
        }
    }
}