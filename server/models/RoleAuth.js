const db = require('../db/db');

module.exports = db.defineModel('role_auth', {
    role_id:db.Sequelize.INTEGER,    
    authtree:db.Sequelize.TEXT,
    func_id:db.Sequelize.INTEGER,
    status:db.Sequelize.INTEGER,
});
