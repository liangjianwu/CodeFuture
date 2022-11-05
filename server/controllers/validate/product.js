const { body, query, oneOf } = require('express-validator')
const { Debug } = require('../../components')

exports.validate = (method) => {
    switch (method) {       
        case 'loadproducts':{
            return [
                query('page').exists().notEmpty().isInt({min:0}),
                query('pagesize').exists().notEmpty().isInt({min:10}),
                query('countdata').exists().notEmpty().isInt().isIn([0,1]),
            ]
        }
        case 'editproduct':{
            return [
                body('id').optional().isInt({min:0}),
                body('name').exists().notEmpty().isString().isLength({min:2,max:64}),
                body('description').optional().isString().isLength({min:2,max:1024}),                
                body('price').exists().notEmpty().isDecimal({min:0}),
                body('coach_Id').optional().isInt({min:0}),
                body('minutes').exists().notEmpty().isInt({min:0}),
            ]
        }
        case 'removeproduct':{
            return [
                body('ids').exists().notEmpty().isArray({min:1,max:100}).custom(a => {
                    return a.every((e) => {
                        if (!isNaN(e) && Number(e) > 0) {
                            return true;
                        } else return false;
                    })
                })
            ]
        }
    }
}