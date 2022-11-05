const db = require('../db/db');

module.exports = db.defineModel('member_info', {      
    member_id:db.Sequelize.INTEGER,
    key:db.Sequelize.STRING(64),
    value:db.Sequelize.STRING(256),
    extend:db.Sequelize.TEXT,
});
