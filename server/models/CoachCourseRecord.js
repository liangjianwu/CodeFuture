const db = require('../db/db');

module.exports = db.defineModel('coach_course_record', {
    coach_id:db.Sequelize.INTEGER,
    isteacher:db.Sequelize.INTEGER,
    class_id:db.Sequelize.INTEGER,
    course_id:db.Sequelize.INTEGER,    
    lesson_id:db.Sequelize.INTEGER,
    duration:db.Sequelize.INTEGER,
    lesson_date:db.Sequelize.DATE,
    fee:db.Sequelize.DECIMAL,
    settle_status:db.Sequelize.INTEGER,
});

