const db = require('../db/db');

module.exports = db.defineModel('user_verify', {
    user_id: db.Sequelize.INTEGER,
    type: db.Sequelize.STRING(16),
    item: db.Sequelize.STRING(64),
    code: db.Sequelize.STRING(8),
    expired_time: db.Sequelize.BIGINT,
    action:db.Sequelize.STRING(32),
    verify_status: db.Sequelize.INTEGER,
    send_status:db.Sequelize.INTEGER,

});
