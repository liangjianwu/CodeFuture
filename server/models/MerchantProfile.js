const db = require('../db/db');

module.exports = db.defineModel('merchant_profile', {
    mid:db.Sequelize.INTEGER,
    name:db.Sequelize.STRING(128) ,
    contact_person:db.Sequelize.STRING(45) ,
    contact_email:db.Sequelize.STRING(64) ,
    contact_phone:db.Sequelize.STRING(32) ,
    address:db.Sequelize.STRING(128) ,
    city:db.Sequelize.STRING(45) ,
    province:db.Sequelize.STRING(45) ,
    country:db.Sequelize.STRING(45) ,
    industry:db.Sequelize.STRING(45) ,
    description:db.Sequelize.TEXT,
    status:db.Sequelize.INTEGER,
});
