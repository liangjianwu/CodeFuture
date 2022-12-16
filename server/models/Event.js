const db = require('../db/db');

module.exports = db.defineModel('event', {     
    area_id:db.Sequelize.INTEGER,   
    name:db.Sequelize.STRING(128),
    code:db.Sequelize.STRING(16),
    sign:db.Sequelize.INTEGER,
    pay:db.Sequelize.INTEGER,
    apply:db.Sequelize.INTEGER,
    form:db.Sequelize.TEXT,
    description:db.Sequelize.STRING(1024),
    code:db.Sequelize.STRING(32),
    pageurl:db.Sequelize.STRING(128),
    html:db.Sequelize.TEXT,
    template:db.Sequelize.TEXT,
    begin:db.Sequelize.DATE,
    end:db.Sequelize.DATE,
    status:db.Sequelize.INTEGER,
    fee:db.Sequelize.DECIMAL,
    photo:db.Sequelize.STRING(32),
    publish_status:db.Sequelize.INTEGER,
});

