const db = require('../db/db');

module.exports = db.defineModel('area', {    
    name:db.Sequelize.STRING(45),
    description:db.Sequelize.STRING(256),
    status:db.Sequelize.INTEGER,
    
});
