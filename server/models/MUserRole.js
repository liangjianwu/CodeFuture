const db = require('../db/db');

module.exports = db.defineModel('muser_role', {
    user_id:db.Sequelize.INTEGER,
    role_id:db.Sequelize.INTEGER,    
    status:db.Sequelize.INTEGER,    
});
