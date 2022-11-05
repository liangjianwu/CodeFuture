const db = require('../db/db');

module.exports = db.defineModel('muser', {
    email:db.Sequelize.STRING(64),
    passwd:db.Sequelize.STRING(64),
    email_verified:db.Sequelize.INTEGER,
    status:db.Sequelize.INTEGER,
});