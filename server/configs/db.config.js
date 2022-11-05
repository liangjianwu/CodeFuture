module.exports = {
    HOST: "127.0.0.1",
    USER: "saas",
    PASSWORD: "saas@1234",
    DB: "clubsaas",
    dialect: "mysql",
    // dialectOptions: {
    //     useUTC: false, //for reading from database
    //     dateStrings: true,
    //     typeCast: true
    // },
    timezone: 'US/Eastern', //for writing to database
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
};