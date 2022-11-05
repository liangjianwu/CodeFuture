const db = require('../db/db');

module.exports = db.defineModel('email_queue', {
    mid:db.Sequelize.INTEGER,    
    user_id:db.Sequelize.INTEGER,
    task_id:db.Sequelize.INTEGER,
    customers:db.Sequelize.TEXT,
    template_id:db.Sequelize.INTEGER,
    title:db.Sequelize.STRING(1024),
    reply:db.Sequelize.STRING(128),
    sender_name:db.Sequelize.STRING(128),
    htmlcontent:db.Sequelize.TEXT,
    textcontent:db.Sequelize.TEXT,
    schedule_time:db.Sequelize.BIGINT,
    sended:db.Sequelize.INTEGER,
    trytimes:db.Sequelize.INTEGER,
    template_values:db.Sequelize.TEXT,
});

