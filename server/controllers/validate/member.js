const { body, query, oneOf } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'setmemberinfostruct': {
            return [                
                body('form','the amount of the items is between 1~50').exists().isArray({min:1,max:50}),
            ]
        }
        case 'editcustomerinfo': {
            return [
                body('id').exists().isInt({ min: 0}),
                body('firstname').optional().isString().isLength({ min: 2, max: 32 }),
                body('lastname').optional().isString().isLength({ min: 2, max: 32 }),
                body('gender').optional().isIn(['Male','Female','Other']),             
                body('phone').optional().isString().isMobilePhone(),
                body('email').optional().isEmail(),
                body('birthday').optional().isDate(),
                body('area_id').exists().isInt({min:1}),               
            ]
        }
        case 'edituser': {
            return [
                body('id').exists().isInt({ min: 0 }),
                body('firstname').exists().isString().isLength({ min: 2, max: 32 }),
                body('lastname').exists().isString().isLength({ min: 2, max: 32 }),
                body('phone').exists().isString().isMobilePhone(),
                body('email').exists().isEmail(), 
                body('area_id').exists().isInt({min:1}),               
            ]
        }
        case 'customer.edit.ext': {
            return [
                body('id').exists().notEmpty().isInt({ min: 0 }),
            ]
        }
        case 'getcustomer': {
            return [
                query('id').exists().notEmpty().isInt({ min: 0 }),
            ]
        }
        case 'loaduser': {
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('status').optional().isIn([-2,-1,0,1,2]),
                query('orderfield').optional().isString().isLength({min:2,max:16}),
                query('order').optional().isIn(['desc','asc']),
            ]
        }
        case 'creategroup': {
            return [
                body('name').exists().notEmpty().isString().isLength({ min: 2, max: 32 }),
            ]
        }
        case 'getgroupcustomers': {
            return [
                query('id').exists().notEmpty().isString(),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('status').optional().isIn([-2,-1,0,1,2,3])
            ]
        }
        case 'addtogroup': {
            return [
                body('ids','The amount of customers should be less than 20!').exists().notEmpty().isArray({ min: 1, max: 20 }).custom(a => {
                    return a.every((e) => {
                        if (!isNaN(e) && Number(e) > 0) {
                            return true;
                        } else return false;
                    });
                }),
                body('groups','The amount of customers should be less than 20!').exists().notEmpty().isArray({ min: 1, max: 20 }).custom(a => {
                    return a.every((e) => {
                        if (!isNaN(e) && Number(e) > 0) {
                            return true;
                        } else return false;
                    });
                })
            ]
        }
        case 'searchcustomer':{
            return [
                query('value','The search value should be name or email or phone').exists().notEmpty().isString().isLength({min:3,max:48}),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('status').optional().isIn([-2,0,1,2,3])
            ]
        }
        case 'searchuser':{
            return [
                query('value','The search value should be name or email or phone').exists().notEmpty().isString().isLength({min:3,max:48}),
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('status').optional().isIn([-2,-1,0,1,2])
            ]
        }
        case 'loadcustomer':{
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
                query('status').optional().isIn([-2,0,1,2,3]),
                query('orderfield').optional().isString().isLength({min:2,max:16}),
                query('order').optional().isIn(['desc','asc']),
            ]
        }
        case 'changememberstatus':{
            return [
                body('id').exists().isInt({min:0}),
                body('status').exists().isIn([0,1,2,3])
            ]
        }
        case 'changememberlevel':{
            return [
                body('id').exists().isInt({min:0}),
                body('level').exists().isIn([0,1,2,3,4,5,6,7,8,9])
            ]
        }
        case 'changeuserstatus':{
            return [
                body('id').exists().isInt({min:0}),
                body('status').exists().isIn([-1,0,1,2])
            ]
        }
        case 'removefromgroup':{
            return [
                body('groupid').exists().notEmpty().isInt({min:0}),
                body('ids','There are somre invalid customer id or too many item to remove').exists().notEmpty().isArray({min:0,max:200}).custom(a=>{
                    return a.every((id)=>{
                        if(!isNaN(id) && Number(id)>0) {
                            return true
                        }else return false
                    })
                })
            ]
        }
    }
}