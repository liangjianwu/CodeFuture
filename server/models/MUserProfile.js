const db = require('../db/db');

module.exports = db.defineModel('muser_profile', {
    user_id:db.Sequelize.INTEGER,
    firstname:db.Sequelize.STRING(32) ,
    lastname:db.Sequelize.STRING(32) ,
    gender:db.Sequelize.STRING(32),
    phone:db.Sequelize.STRING(32) ,
    email:db.Sequelize.STRING(64),
    address:db.Sequelize.STRING(128) ,
    city:db.Sequelize.STRING(45) ,
    province:db.Sequelize.STRING(45) ,
    country:db.Sequelize.STRING(45) ,
    postcode:db.Sequelize.STRING(16),
    name_verified:db.Sequelize.INTEGER,
    phone_verified:db.Sequelize.INTEGER,    
});
