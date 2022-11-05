const db = require('../db/db');

module.exports = db.defineModel('email_log', {
    email_queue_id:db.Sequelize.INTEGER,    
    result:db.Sequelize.STRING(16),
    note:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
});

