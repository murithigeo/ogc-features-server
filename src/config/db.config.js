require('dotenv').config();
/*module.exports = {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}*/
module.exports = {
    development: {
        url: process.env.DEV_DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            useUTC:false,
        },
        timezone:'+03:00'
    },
    test: {
        url: process.env.TEST_DATABASE_URL,
        dialect: 'postgres',
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
    },
};
