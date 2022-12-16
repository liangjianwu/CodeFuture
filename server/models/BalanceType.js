const db = require('../db/db');

module.exports = db.defineModel('balance_type', {    
    type:db.Sequelize.STRING(45),
    status:db.Sequelize.INTEGER,
    level:db.Sequelize.INTEGER,
});
