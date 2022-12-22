const db = require('../db/db');

module.exports = db.defineModel('class', {
    course_id:db.Sequelize.INTEGER,
    name:db.Sequelize.STRING(64),
    teacher_id:db.Sequelize.INTEGER,
    assistant_id:db.Sequelize.INTEGER,
    students_id:db.Sequelize.INTEGER,
    lessons:db.Sequelize.INTEGER,
    current_lesson:db.Sequelize.INTEGER,
    note:db.Sequelize.STRING(256),
    begindate:db.Sequelize.DATE,
});

