const db = require('../db/db');

module.exports = db.defineModel('task_log', {
    task_id:db.Sequelize.INTEGER,
    user_id:db.Sequelize.INTEGER,        
    template_id:db.Sequelize.INTEGER,
    execute_code:db.Sequelize.STRING(16),    
    execute_result:db.Sequelize.TEXT,    
});

