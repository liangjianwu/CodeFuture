const db = require('../db/db');

module.exports = db.defineModel('coach_schedule', {
    plan_code:db.Sequelize.BIGINT,
    coach_id:db.Sequelize.INTEGER,
    product_id:db.Sequelize.INTEGER,
    member_id:db.Sequelize.INTEGER,
    wod:db.Sequelize.INTEGER,
    from:db.Sequelize.DATE,
    to:db.Sequelize.DATE,
    begintime:db.Sequelize.INTEGER,
    duration:db.Sequelize.INTEGER,
    status:db.Sequelize.INTEGER,
});

