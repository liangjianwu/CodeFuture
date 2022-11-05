const {Hint,Debug,ErrorHint,Log} = require('../components')

const fs = require('fs');
const db = require('./db');


let files = fs.readdirSync(__dirname + '/../models');

let js_files = files.filter((f) => {
    return f.endsWith('.js');
}, files);

module.exports = {};

for (let f of js_files) {
    Log(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    module.exports[name] = require(__dirname + '/../models/' + f);
}

module.exports.sync = () => {
    Log("start sync db")
    db.sequelize.sync({ force: true ,logging: Log }).then(() => {
        Log("Drop and re-sync db.");
    }).catch(err=>{
        ErrorHint(err.message)
    });

    // db.sequelize.authenticate().then( () => {
    //     Log('Connection has been established successfully.');
        
    
    //     sequelize.sync({logging:Log, force:true})
    //         .then(() => {
    //             Log(`Database & tables created!`);                
    //         }).catch((error)=>{
    //             return console.error(error);
    //         });
    
    // }).catch((error) => {
    //     console.error('Unable to connect to the database:', error);
    // })
};