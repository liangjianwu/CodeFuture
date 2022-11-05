const db = require('../db/db');

module.exports = db.defineModel('member', { 
    user_id:db.Sequelize.INTEGER,   
    lastname: db.Sequelize.STRING(45),
    firstname: db.Sequelize.STRING(45),
    name: db.Sequelize.STRING(45),
    gender: db.Sequelize.STRING(16),
    email: db.Sequelize.STRING(64),
    phone: db.Sequelize.STRING(16),    
    birthday:db.Sequelize.DATE,
    status:db.Sequelize.INTEGER,
    level:db.Sequelize.INTEGER,
});
