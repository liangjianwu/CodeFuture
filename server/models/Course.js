const db = require('../db/db');

module.exports = db.defineModel('course', {
    name:db.Sequelize.STRING(45),
    description:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
    lessonhours:db.Sequelize.INTEGER,
});

