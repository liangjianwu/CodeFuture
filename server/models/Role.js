const db = require('../db/db');

module.exports = db.defineModel('role', {    
    name:db.Sequelize.STRING(45),
    status:db.Sequelize.INTEGER,
    note:db.Sequelize.STRING(128),
});