const { body, query, oneOf } = require('express-validator')
const { Debug } = require('../../components')

exports.validate = (method) => {
    switch (method) {       
        case 'loadtemplates':{
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'edittemplate':{
            return [
                body('id').optional().isInt({min:0}),
                body('name','max length is 45').exists().notEmpty().isString().isLength({min:2,max:45}),
                body('description','max length is 1024').optional().isLength({min:0,max:1024}),
                body('variables','1~100 variables').exists().notEmpty().isString().isLength({min:1,max:2000}),
                body('title','length is from 3 to 128').exists().notEmpty().isString().isLength({min:3,max:128}),
                body('reply').optional().isEmail(),
                body('sender_name').optional().isString().isLength({min:0,max:128}),
                body('template','max length is 400k').exists().notEmpty().isString().isLength({min:3,max:409600}),                
            ]
        }
        case 'gettemplate':{
            return [
                query('id').exists().notEmpty().isInt({min:1})
            ]
        }
        case 'removetemplate':{
            return [
                body('id').exists().notEmpty().isInt({min:1})
            ]
        }
        case 'clonetemplate':{
            return [
                body('id').exists().notEmpty().isInt({min:1})
            ]
        }
        case 'gethouse':{
            return [
                query('id').exists().notEmpty().isString().isLength({min:6,max:10})
            ]
        }
        case 'edittask':{
            return [
                body('template_id').exists().isInt({min:1}),
                body('datasource').optional().isString().isLength({min:1}),
                body('customers',"You can select 1~200 customers").exists().isArray({min:1,max:200}),
                body('schedule_time').exists().isDate(),
            ]
        }
        case 'gettask':{
            return [
                query('id').exists().notEmpty().isInt({min:1})
            ]
        }
        case 'loadtaskresult':{
            return [
                query('id').exists().notEmpty().isInt({min:1})
            ]
        }
        case 'settaskstatus':{
            return [
                body('id').exists().notEmpty().isInt({min:1}),
                body('status').exists().isInt().isIn([0,1])
            ]
        }
        case 'loadtasks':{
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
    }
}