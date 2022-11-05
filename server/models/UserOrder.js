const db = require('../db/db');

module.exports = db.defineModel('user_order', {    
    user_id:db.Sequelize.INTEGER,   
    member_id:db.Sequelize.INTEGER, 
    member_name:db.Sequelize.STRING(45),
    product_id:db.Sequelize.INTEGER,
    product_name:db.Sequelize.STRING(128),
    product_price:db.Sequelize.DECIMAL(2),    
    count:db.Sequelize.INTEGER,
    amount:db.Sequelize.DECIMAL(2),
    charge:db.Sequelize.DECIMAL(2),
    order_date:db.Sequelize.DATE,
    coach_id:db.Sequelize.INTEGER,
    peoples:db.Sequelize.INTEGER,
});

