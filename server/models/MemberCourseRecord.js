const db = require('../db/db');

module.exports = db.defineModel('member_course_record', {
    class_id:db.Sequelize.INTEGER,
    member_id:db.Sequelize.INTEGER,
    teacher_id:db.Sequelize.INTEGER,
    assistant_id:db.Sequelize.INTEGER,
    course_id:db.Sequelize.INTEGER,
    lesson_id:db.Sequelize.INTEGER,
    duration:db.Sequelize.INTEGER,
    lesson_date:db.Sequelize.DATE,
    fee:db.Sequelize.DECIMAL,
    settle_status:db.Sequelize.INTEGER,
});

