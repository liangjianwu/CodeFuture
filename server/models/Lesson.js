const db = require('../db/db');

module.exports = db.defineModel('lesson', {
    course_id:db.Sequelize.INTEGER,
    name:db.Sequelize.STRING(45),
    description:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
    lessonNo:db.Sequelize.INTEGER,    
});

