const db = require('../db/db');

module.exports = db.defineModel('class_member', {
    class_id:db.Sequelize.INTEGER,    
    member_id:db.Sequelize.INTEGER,
    from_lesson:db.Sequelize.INTEGER,
    fee:db.Sequelize.DECIMAL,
    real_fee:db.Sequelize.DECIMAL,    
    join_date:db.Sequelize.DATE,
    status:db.Sequelize.INTEGER,
});

