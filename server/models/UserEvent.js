
const db = require('../db/db');

module.exports = db.defineModel('user_event', {
    user_id:db.Sequelize.INTEGER,
    event_id:db.Sequelize.INTEGER,
    member_id:db.Sequelize.INTEGER,
    code:db.Sequelize.STRING(6),
    form:db.Sequelize.TEXT,
    pay_amount:db.Sequelize.DECIMAL,
    pay_status:db.Sequelize.INTEGER,
    pay_order:db.Sequelize.STRING(64),
    pay_time:db.Sequelize.STRING(32),
    pay_method:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
});

