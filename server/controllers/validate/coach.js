const { body, query, oneOf } = require('express-validator')
const { Debug } = require('../../components')

exports.validate = (method) => {
    switch (method) {
        case 'editcoach': {
            return [
                body('id').exists().isInt({ min: 0 }),
                body('name').exists().isString().isLength({ min: 2, max: 64 }),
                body('email').exists().isEmail(),
                body('phone').exists().isMobilePhone(),
                body('passwd').optional().isString().isMD5(),
            ]
        }
        case 'remove': {
            return [
                query('id').exists().isInt({ min: 1 }),
            ]
        }
        case 'loadcoachtime': {
            return [
                query('id').exists().notEmpty().isInt({ min: 1 }),
                query('page').exists().notEmpty().isInt({ min: 0 }),
                query('pagesize').exists().notEmpty().isInt({ min: 10 }),
                query('countdata').exists().notEmpty().isInt().isIn([0, 1]),
            ]
        }
        case 'loadcoachrecord': {
            return [
                query('id').exists().notEmpty().isInt({ min: 0 }),
                query('from').exists().notEmpty().isDate(),
                query('to').exists().notEmpty().isDate(),
            ]
        }
        case 'addschedule': {
            return [
                //body('id').exists().isInt({min:0}),
                body('coach_id').exists().isInt({min:0}),
                body('product_id').exists().isInt({min:0}),
                body('members').optional().isArray({min:0}),
                body('wods').exists().isArray({min:1}),
                body('from').exists().isDate(),
                body('to').optional().isDate(),
                body('begintime').exists().isInt({min:360,max:1380}),
                body('duration').exists().isInt({min:5,max:480}),                
            ]
        }
        case 'schedulestatus':{
            return [
                body('id').exists().isInt({min:0}),
                body('status').exists().isIn([0,1,2,3])
            ]
        }  
        case 'deleteschedule': {
            return [
                body('id').exists().isInt({min:0}),
                body('type').exists().isIn(['member','plan']),
                body('option').exists().isIn([0,1,2]),
            ]
        }
        case 'editschedule': {
            return [
                body('id').exists().isInt({min:0}),
                body('type').exists().isIn(['member','plan']),
                body('option').exists().isIn([0,1,2]),
                body('product_id').optional().isInt({min:1}),
                body('coach_id').optional().isInt({min:1}),
                body('members').optional().isArray({min:0}),
                body('wod').optional().isIn([0,1,2,3,4,5,6]),
                body('begintime').optional().isInt({min:360,max:1380}),
                body('duration').optional().isInt({min:5,max:480}),                
            ]
        }
        case 'loadschedule':{
            return [
                query('coach_id').optional().isInt({min:0}),
                query('member_id').optional().isInt({min:0}),
                query('from').optional().isDate(),
                query('data').exists().isIn([0,1]),
            ]
        }
    }
}