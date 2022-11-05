const db = require('../db/db');

module.exports = db.defineModel('email_template', {
    mid:db.Sequelize.INTEGER,    
    name:db.Sequelize.STRING(45),
    description:db.Sequelize.TEXT,
    title:db.Sequelize.STRING(256),
    reply:db.Sequelize.STRING(128),
    sender_name:db.Sequelize.STRING(128),
    datasource:db.Sequelize.STRING(16),
    variables:db.Sequelize.TEXT,
    template:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
});

