const db = require('../db/db');

module.exports = db.defineModel('user_balance', {
    user_id:db.Sequelize.INTEGER,
    member_id:db.Sequelize.INTEGER,
    type:db.Sequelize.STRING(16),
    balance:db.Sequelize.DECIMAL(2),
    status:db.Sequelize.INTEGER,
});

