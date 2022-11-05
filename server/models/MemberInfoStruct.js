const db = require('../db/db');

module.exports = db.defineModel('memberinfo_struct', {      
    struct:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
});
