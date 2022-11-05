const db = require('../db/db');

module.exports = db.defineModel('schedule_record', {
    plan_code:db.Sequelize.BIGINT,
    schedule_id:db.Sequelize.INTEGER,
    coach_id:db.Sequelize.INTEGER,
    product_id:db.Sequelize.INTEGER,
    member_id:db.Sequelize.INTEGER,
    wod:db.Sequelize.INTEGER,
    sdate:db.Sequelize.STRING(10),
    begintime:db.Sequelize.INTEGER,
    duration:db.Sequelize.INTEGER,
    original:db.Sequelize.INTEGER,
    status:db.Sequelize.INTEGER,
});

