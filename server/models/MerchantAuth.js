const db = require('../db/db');

module.exports = db.defineModel('merchant_auth', {    
    mid:db.Sequelize.INTEGER,
    domain:db.Sequelize.STRING(128),
    path0:db.Sequelize.STRING(64),
    token:db.Sequelize.STRING(64),
});
