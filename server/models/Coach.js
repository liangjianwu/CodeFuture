const db = require('../db/db');

module.exports = db.defineModel('coach', {
    name:db.Sequelize.STRING(64),
    email:db.Sequelize.STRING(64),
    phone:db.Sequelize.STRING(24),
    passwd:db.Sequelize.STRING(64),
    token:db.Sequelize.STRING(64),
    ip:db.Sequelize.STRING(16),
    device:db.Sequelize.STRING(64),
    status:db.Sequelize.INTEGER,
    currentminutes:db.Sequelize.INTEGER,
    currentmonth:db.Sequelize.STRING(10),
    expired_time:db.Sequelize.BIGINT,
});

