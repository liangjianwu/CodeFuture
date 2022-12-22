const { returnResult, returnError, returnSuccess } = require("../../components/errcode")
const model = require("../../db/model");
const { body, query, oneOf } = require('express-validator')
const { ErrorHint, Debug } = require("../../components");
const { checkAuth } = require("../auth");
const { doWithTry } = require("../../controllers/utils/Common");
const db = require("../../db/db");
const Lesson = model.Lesson
const LessonPage = model.LessonPage

module.exports.lesson = {
    get:[
        [
            query('id','the id should be a number').exists().isInt({min:1}),            
        ],
        async (req, res) => {
            let {id} = req.query            
            doWithTry(res, async () => {
                let where = { mid: req.mid,id:id}
                Lesson.hasMany(LessonPage,{foreignKey:"lesson_id"})
                let option = { 
                    attributes: ['id', 'name', 'description','lessonNo','course_id','status'], 
                    where: where,
                }
                option.include = [{model:LessonPage,order:[["pageNo",'asc']]}]
                let lesson = await Lesson.findOne(option)
                return returnResult(res,lesson)
            })
        }
    ]
}