const db = require('../db/db');

module.exports = db.defineModel('task', {
    mid:db.Sequelize.INTEGER,    
    type:db.Sequelize.STRING(45),
    customers:db.Sequelize.TEXT,
    template_id:db.Sequelize.INTEGER,
    datasource:db.Sequelize.STRING(128),    
    data:db.Sequelize.TEXT,
    schedule_time:db.Sequelize.DATEONLY,
    status:db.Sequelize.INTEGER,
});

