const { returnSuccess, returnError, returnResult } = require("../components/errcode")
const { body, query, oneOf } = require('express-validator')
const { ErrorHint, Debug } = require("../components");
const md5 = require("md5");
const db = require('../db/db')
const model = require('../db/model');
const { doWithTry } = require("./utils/Common");

const Lesson = model.Lesson
const Course = model.Course
const LessonPage = model.LessonPage

module.exports.courses = {
    get: async (req, res) => {
        let {status} = req.query
        doWithTry(res, async () => {
            let where = { mid: req.mid }
            status && (where.status = status)
            let courses = await Course.findAll({ attributes: ['id', 'name', 'description','lessonhours','status'], where: where })
            return returnResult(res,courses)
        })
    }
}

module.exports.course = {
    get: [
        [
            query('id','the id should be a number').exists().isInt({min:1}),
            query('lesson').optional().isIn([0,1]),
        ],
        async (req, res) => {
            let {id,lesson} = req.query            
            doWithTry(res, async () => {
                let where = { mid: req.mid,id:id}
                if(lesson == 1) {
                    Course.hasMany(Lesson,{foreignKey:"course_id"})
                }
                let option = { 
                    attributes: ['id', 'name', 'description','lessonhours','status'], 
                    where: where,
                }
                lesson == 1 && (option.include = [{model:Lesson,attributes:["id","name","description","lessonNo"],order:[["lessonNo",'asc']],required:false}])
                let course = await Course.findOne(option)
                return returnResult(res,course)
            })
        }
    ],
    post: [
        [
            body("name").exists().isString().isLength({min:6,max:45}),
            body('lessonhours').exists().isInt({min:1,max:60}),
            body('description').optional().isString({max:256}),
        ],
        async (req,res)=>{
            let {name,lessonhours,description} = req.body
            doWithTry(res, async () => {
                let course = await Course.findOne({where:{name:name,mid:req.mid}})
                if(course) {
                    return returnError(res,800001)
                }
                course = await Course.create({name,description,lessonhours,mid:req.mid,status:0})                
                return returnResult(res,course.id)
            })
        }
    ],
    put: [
        [
            body("id").exists().isInt({min:1}),
            body("name").optional().isString().isLength({min:6,max:45}),
            body('lessonhours').optional().isInt({min:1,max:60}),
            body('description').optional().isString({max:256}),
            body('status').optional().isIn([0,1]),
        ],
        async (req,res)=>{
            let {id,name,lessonhours,description,status} = req.body
            doWithTry(res, async () => {
                let course = await Course.findOne({where:{id:id,mid:req.mid}})
                if(!course) {
                    return returnError(res,800002)
                }
                await Course.update({name,description,lessonhours,status},{where:{id:id,mid:req.mid}})
                return returnResult(res,'ok')
            })
        }
    ],
    delete: [
        [
            query("id").exists().isInt({min:1}),          
        ],
        async (req,res)=>{
            let {id} = req.query
            doWithTry(res, async () => {
                let course = await Course.findOne({where:{id:id,mid:req.mid}})
                if(!course) {
                    return returnError(res,800002)
                }
                await Course.update({status:0},{where:{id:id,mid:req.mid}})
                return returnResult(res,'ok')
            })
        }
    ],   
}

module.exports.lesson = {
    get: [
        [
            query('id','the id should be a number').exists().isInt({min:1}),
            query('content').optional().isIn([0,1]),
        ],
        async (req, res) => {
            let {id,content} = req.query            
            doWithTry(res, async () => {
                let where = { mid: req.mid,id:id}
                content == 1 && Lesson.hasMany(LessonPage,{foreignKey:"lesson_id"})
                let option = { 
                    attributes: ['id', 'name', 'description','lessonNo','course_id','status'], 
                    where: where,
                }
                content == 1 && (option.include = [{model:LessonPage,order:[["pageNo",'asc']]}])
                let lesson = await Lesson.findOne(option)
                return returnResult(res,lesson)
            })
        }
    ],
    post: [
        [
            body("name").exists().isString().isLength({min:6,max:45}),
            body('course_id').exists().isInt({min:1}),
            body('description').optional().isString({max:256}),
            body('lessonNo').exists().isInt({min:1,max:60}),            
        ],
        async (req,res)=>{
            let {name,lessonNo,course_id,description} = req.body
            doWithTry(res, async () => {                
                let lesson = await Lesson.create({name,description,lessonNo,course_id,status:0,mid:req.mid})                
                return returnResult(res,lesson.id)
            })
        }
    ],
    put: [
        [
            body("id").exists().isInt({min:1}),
            body("name").optional().isString().isLength({min:6,max:45}),
            body('description').optional().isString({max:256}),
            body('lessonNo').optional().isInt({min:1,max:60}),      
            body('status').optional().isIn([0,1]),  
        ],
        async (req,res)=>{
            let {id,name,lessonNo,description,status} = req.body
            Debug(req.body)
            doWithTry(res, async () => {
                let course = await Lesson.findOne({where:{id:id,mid:req.mid}})
                if(!course) {
                    return returnError(res,800003)
                }
                Lesson.update({name,lessonNo,description,status},{where:{id:id,mid:req.mid}})
                return returnResult(res,'ok')
            })
        }
    ],
    delete: [
        [
            query("id").exists().isInt({min:1}),          
        ],
        async (req,res)=>{
            let {id} = req.query
            doWithTry(res, async () => {
                let course = await Lesson.findOne({where:{id:id,mid:req.mid}})
                if(!course) {
                    return returnError(res,800003)
                }
                await Lesson.update({status:0},{where:{id:id,mid:req.mid}})
                return returnResult(res,'ok')
            })
        }
    ],   
}


module.exports.lessonpage = {
    get: [
        [
            query('id','the id should be a number').exists().isInt({min:1}),            
        ],
        async (req, res) => {
            let {id} = req.query            
            doWithTry(res, async () => {
                let where = { mid: req.mid,id:id}                
                let option = {                     
                    where: where,
                }                
                let lesson = await LessonPage.findOne(option)
                return returnResult(res,lesson)
            })
        }
    ],
    post: [
        [
            body("title").exists().isString().isLength({min:6,max:45}),
            body('lesson_id').exists().isInt({min:1}),
            body('content').optional().isString({min:2,max:256}),
            body('pageNo').exists().isInt({min:1,max:60}),            
        ],
        async (req,res)=>{
            let {title,lesson_id,content,pageNo} = req.body
            doWithTry(res, async () => {                
                let lesson = await LessonPage.create({title,lesson_id,content,pageNo,status:0,mid:req.mid})                
                return returnResult(res,lesson.id)
            })
        }
    ],
    put: [
        [
            body("id").exists().isInt({min:1}),
            body("title").optional().isString().isLength({min:6,max:45}),
            body('content').optional().isString({max:256}),
            body('pageNo').optional().isInt({min:1,max:60}),     
            body('status').optional().isIn([0,1]),     
        ],
        async (req,res)=>{
            let {id,title,content,pageNo,status} = req.body
            doWithTry(res, async () => {
                let course = await LessonPage.findOne({where:{id:id,mid:req.mid}})
                if(!course) {
                    return returnError(res,800004)
                }
                await LessonPage.update({title,content,pageNo,status},{where:{id:id,mid:req.mid}})
                return returnResult(res,'ok')
            })
        }
    ],
    delete: [
        [
            query("id").exists().isInt({min:1}),          
        ],
        async (req,res)=>{
            let {id} = req.query
            doWithTry(res, async () => {
                let course = await LessonPage.findOne({where:{id:id,mid:req.mid}})
                if(!course) {
                    return returnError(res,800004)
                }
                await LessonPage.update({status:0},{where:{id:id,mid:req.mid}})
                return returnResult(res,'ok')
            })
        }
    ],   
}