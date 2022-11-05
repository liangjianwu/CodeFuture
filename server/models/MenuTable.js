const db = require('../db/db');

module.exports = db.defineModel('menu_table', {        
    type:db.Sequelize.INTEGER,
    name:db.Sequelize.STRING(45),
    desciprtion:db.Sequelize.STRING(256),
    url:db.Sequelize.STRING(128),    
});

