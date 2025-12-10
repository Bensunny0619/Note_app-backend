const path = require('path');
require('dotenv').config();

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'noteapp_dev'
        },
        migrations: {
            directory: path.join(__dirname, 'migrations'),
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: path.join(__dirname, 'seeds')
        }
    },

    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: path.join(__dirname, 'migrations'),
            tableName: 'knex_migrations'
        },
        pool: {
            min: 2,
            max: 10
        }
    }
};
