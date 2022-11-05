const { Debug } = require("../components");
//const fetch = require('node-fetch');
const request = require('request');

module.exports.getHouse = (id, callback) => {
    let url = "http://fenghill.com:8080/estate/house/gethouse?id=" + id;

    // let settings = { method: "Get" };
    // fetch(url, settings)
    //     .then(res => res.json())
    //     .then((json) => {
    //         callback(json)
    //     }).catch(e=>{
    //         callback({success:false,result:e.message})
    //     });
    let options = { json: true };
    request(url, options, (error, res, body) => {
        //Debug([error,body])
        if (error) {
            callback({success:false,result:error})
        }
        if (!error && res.statusCode == 200) {
            callback(body)
        }
    });
}