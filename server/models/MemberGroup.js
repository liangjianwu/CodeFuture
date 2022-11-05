const db = require('../db/db');

module.exports = db.defineModel('member_group', {      
    member_id:db.Sequelize.INTEGER,
    group_id:db.Sequelize.INTEGER,
    status:db.Sequelize.INTEGER,
});
