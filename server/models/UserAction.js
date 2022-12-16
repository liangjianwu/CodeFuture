
const db = require('../db/db');

module.exports = db.defineModel('user_action', {    
    user_type:db.Sequelize.INTEGER,
    user_id:db.Sequelize.INTEGER,
    action:db.Sequelize.STRING(45),
    url:db.Sequelize.STRING(128),
    content:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
});

