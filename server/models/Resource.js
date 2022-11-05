const db = require('../db/db');

module.exports = db.defineModel('resource', {
    name:db.Sequelize.STRING(45),
    path:db.Sequelize.STRING(128),
    description:db.Sequelize.STRING(256),
    status:db.Sequelize.INTEGER,
    type:db.Sequelize.STRING(16),
    resource_type:db.Sequelize.STRING(16),
    order:db.Sequelize.INTEGER,
    islocal:db.Sequelize.INTEGER,
});
