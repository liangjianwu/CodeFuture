const db = require('../db/db');

module.exports = db.defineModel('menu_table', {        
    type:db.Sequelize.INTEGER,
    name:db.Sequelize.STRING(45),
    description:db.Sequelize.STRING(256),
    url:db.Sequelize.STRING(128),
    parent_id:db.Sequelize.INTEGER,
    method:db.Sequelize.STRING(4),
    position:db.Sequelize.INTEGER,
    status:db.Sequelize.INTEGER, 
});

