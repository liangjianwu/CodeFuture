const db = require('../db/db');

module.exports = db.defineModel('muser_auth', {
    user_id:db.Sequelize.INTEGER,    
    token:db.Sequelize.STRING(64),
    expired_time:db.Sequelize.BIGINT,
    ip:db.Sequelize.STRING(16),
    device:db.Sequelize.STRING(64),
});