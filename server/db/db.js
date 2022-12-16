const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');
const dbConfig = require('../configs/db.config');

const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host: dbConfig.HOST,
    //timezone:'-04:00',
    dialect: dbConfig.dialect,
    operatorAliases:false,
    // dialectOptions: {
    //     useUTC: false, //for reading from database
    //     dateStrings: true,
    //     typeCast: true
    // },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        idle: dbConfig.pool.idle,
        acquire:dbConfig.pool.acquire,
    },
    logging:true,
});

const ID_TYPE = Sequelize.INTEGER;

function defineModel(name, attributes) {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || true;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: true
            };
        }
    }
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true,
        autoIncrement: true,
    };
    attrs.mid = {
        type: INTEGER,
        default:0,
    };    
    attrs.create_time = {
        type: Sequelize.DATE,
        allowNull: false
    };
    attrs.update_time = {
        type: Sequelize.DATE,
        allowNull: false
    };
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        paranoid: true,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                //let now = new Date().toLocaleString("en-US", { timeZone: "America/Toronto" });                
                if (obj.isNewRecord) {                    
                    obj.create_time = now;
                    obj.update_time = now;            
                } else {
                    obj.update_time = now;
                }
            }
        }
    });
}

const db = {};
db.defineModel = defineModel;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;