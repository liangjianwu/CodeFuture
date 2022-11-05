const db = require('../db/db');

module.exports = db.defineModel('balance_type', {    
    name:db.Sequelize.STRING(45),
});
