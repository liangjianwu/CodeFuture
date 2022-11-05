const db = require('../db/db');

module.exports = db.defineModel('user_balance_record', {
    user_id:db.Sequelize.INTEGER,    
    member_id:db.Sequelize.INTEGER,
    balance_id:db.Sequelize.INTEGER,
    amount:db.Sequelize.DECIMAL(2),
    pre_balance:db.Sequelize.DECIMAL(2),
    action:db.Sequelize.STRING(16),
    order:db.Sequelize.STRING(32),
    orderinfo:db.Sequelize.TEXT,
    source:db.Sequelize.STRING(32) ,
    note:db.Sequelize.STRING(128) ,
    evidence:db.Sequelize.STRING(128) , 
    invoice:db.Sequelize.STRING(32) ,
    invoice_note:db.Sequelize.STRING(128) ,
    refer:db.Sequelize.INTEGER,
    status:db.Sequelize.INTEGER,
    ip:db.Sequelize.STRING(16) ,  
});
