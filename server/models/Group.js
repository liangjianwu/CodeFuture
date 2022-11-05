const db = require('../db/db');

module.exports = db.defineModel('group', {    
    name:db.Sequelize.STRING(45) ,
    note:db.Sequelize.STRING(128),
    status:db.Sequelize.INTEGER,
});
