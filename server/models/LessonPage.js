const db = require('../db/db');

module.exports = db.defineModel('lesson_page', {
    lesson_id:db.Sequelize.INTEGER,
    title:db.Sequelize.STRING(45),
    content:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
    pageNo:db.Sequelize.INTEGER,    
});

