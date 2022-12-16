const db = require('../db/db');

module.exports = db.defineModel('product', {    
    area_id:db.Sequelize.INTEGER,
    name:db.Sequelize.STRING(64) ,    
    description:db.Sequelize.TEXT,    
    list_price:db.Sequelize.DECIMAL(2),
    price:db.Sequelize.DECIMAL(2),    
    chargeto:db.Sequelize.STRING(16),
    coach_id:db.Sequelize.INTEGER,
    minutes:db.Sequelize.INTEGER,
    status:db.Sequelize.INTEGER,
});
