require('dotenv').config();

export default {
    development: {
        url: process.env.DEV_DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            useUTC: true
        },
        timezone: '+03:00'
    },
    test: {
        url: process.env.TEST_DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            useUTC: true
        },
        timezone: '+03:00'
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        dialectOptions: {
            useUTC: true
        },
        timezone: '+03:00'
    }
}