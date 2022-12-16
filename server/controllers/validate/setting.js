const { body,query,oneOf } = require('express-validator')

exports.validate = (method) => {
    switch (method) {
        case 'user.post': {    
            return [ 
                body('email').exists().notEmpty().isEmail(),                
                body('passwd').exists().notEmpty().isMD5(),
                body('firstname').exists().notEmpty().isString().isLength({min:1,max:16}),
                body('lastname').exists().notEmpty().isString().isLength({min:1,max:16}),
                body('phone').optional().isMobilePhone(),
                body('gender').optional().isIn(['male','female','other']),
                body('area_id').exists().isInt({min:1}),
            ]   
        }
        case 'user.put': {    
            return [ 
                body('id').exists().isInt({min:1}),
                body('email').optional().notEmpty().isEmail(),                
                body('passwd').optional().notEmpty().isMD5(),
                body('is_coach').optional().isIn([0,1]),
                body('is_assistant').optional().isIn([0,1]),                
                body('firstname').optional().notEmpty().isString().isLength({min:1,max:16}),
                body('lastname').optional().notEmpty().isString().isLength({min:1,max:16}),
                body('phone').optional().isMobilePhone(),
                body('gender').optional().isIn(['male','female','other']),
                body('area_id').optional().isInt({min:1}),
                body('status').optional().isIn([0,1,2]),
            ]   
        }
        case 'user.get':{
            return [
                query('id').exists().isInt({min:0})
            ]
        }
        case 'user.delete':{
            return [
                query('id').exists().isInt({min:1})
            ]
        }
        case 'role.post': {    
            return [                 
                body('name').exists().notEmpty().isString().isLength({min:3,max:32}),
                body('note').optional().isString().isLength({min:0,max:128}),                
            ]   
        }
        case 'role.put': {    
            return [ 
                body('id').exists().isInt({min:1}),
                body('name').optional().notEmpty().isString().isLength({min:3,max:32}),
                body('note').optional().isString().isLength({min:0,max:128}), 
                body('status').optional().isIn([0,1,2]),
            ]   
        }
        case 'role.get':{
            return [
                query('id').exists().isInt({min:0})
            ]
        }
        case 'role.delete':{
            return [
                query('id').exists().isInt({min:1})
            ]
        }
        case 'menu.post': {    
            return [                 
                body('type').exists().notEmpty().isIn([0,1,2]),
                body('name').exists().notEmpty().isString().isLength({min:3,max:32}),
                body('description').optional().isString().isLength({min:0,max:256}),                
                body('url').exists().notEmpty().isString().isLength({min:3,max:128}),
                body('parent_id').exists().isInt({min:0}),
                body('method').exists().isString().isLength({min:4,max:4}),
            ]   
        }
        case 'menu.put': {    
            return [ 
                body('id').exists().isInt({min:1}),
                body('type').optional().notEmpty().isIn([0,1,2]),
                body('name').optional().notEmpty().isString().isLength({min:3,max:32}),
                body('description').optional().isString().isLength({min:0,max:256}),                
                body('url').optional().notEmpty().isString().isLength({min:3,max:128}),
                body('status').optional().isIn([0,1,2]),
                body('parent_id').optional().isInt({min:0}),
                body('method').optional().isString().isLength({min:4,max:4}),
            ]   
        }
        case 'menu.get':{
            return [
                query('id').exists().isInt({min:0})
            ]
        }
        case 'menu.delete':{
            return [
                query('id').exists().isInt({min:1})
            ]
        }
        case 'roleauth.post': {    
            return [                 
                body('role_id').exists().notEmpty().isInt({min:1}),
                body('menu_id').exists().notEmpty().isInt({min:1}),                
            ]   
        }   
        case 'roleauth.put': {    
            return [                 
                body('id').exists().isInt({min:1}),
                body('status').exists().isIn([0,1,2])
            ]   
        }        
        case 'roleauth.get':{
            return [
                query('id').exists().isInt({min:1})
            ]
        }
        case 'roleauth.delete':{
            return [
                query('id').exists().isInt({min:1})
            ]
        }
        case 'userrole.post': {    
            return [                 
                body('role_id').exists().notEmpty().isInt({min:1}),
                body('user_id').exists().notEmpty().isInt({min:1}),                
            ]   
        }        
        case 'userrole.get':{
            return [
                query('user_id').optional().isInt({min:0}),
                query('role_id').optional().isInt({min:0})
            ]
        }
        case 'userrole.delete':{
            return [
                query('id').exists().isInt({min:1})
            ]
        }
        case 'userrole.put': {    
            return [                 
                body('id').exists().isInt({min:1}),
                body('status').exists().isIn([0,1,2])
            ]   
        }   
        case 'balance.post': {    
            return [                 
                body('type').exists().notEmpty().isString().isLength({min:3,max:32}),
                body('level').exists().notEmpty().isInt({min:0}),                
            ]   
        }   
        case 'balance.put': {    
            return [    
                body('id').exists().isInt({min:1}),             
                body('type').optional().notEmpty().isString().isLength({min:3,max:32}),
                body('level').optional().notEmpty().isInt({min:0}),    
                body('status').optional().isIn([0,1,2]),             
            ]   
        }                
        case 'balance.delete':{
            return [
                query('id').exists().isInt({min:1})
            ]
        }
        case 'balance.get':{
            return [
                query('id').exists().isInt({min:0})
            ]
        }
        case 'area.post': {    
            return [                 
                body('name').exists().notEmpty().isString().isLength({min:3,max:32}),
                body('description').exists().notEmpty().isString().isLength({min:0,max:256}),                
            ]   
        }   
        case 'area.put': {    
            return [    
                body('id').exists().isInt({min:1}),             
                body('name').optional().isString().isLength({min:3,max:32}),
                body('description').optional().isString().isLength({min:0,max:256}),      
                body('status').optional().isIn([0,1,2]),             
            ]   
        }                
        case 'area.delete':{
            return [
                query('id').exists().isInt({min:1})
            ]
        }
        case 'area.get':{
            return [
                query('id').exists().isInt({min:0})
            ]
        }
    }
}