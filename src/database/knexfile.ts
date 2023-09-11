import { Knex } from 'knex';

// Update with your config settings.
const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_USER_PWD,
        },
        migrations: {
            directory: __dirname + '/migrations',
        },
    },

    // staging: {
    //     client: 'postgresql',
    //     connection: {
    //         database: 'my_db',
    //         user: 'username',
    //         password: 'password',
    //     },
    //     pool: {
    //         min: 2,
    //         max: 10,
    //     },
    //     migrations: {
    //         tableName: 'knex_migrations',
    //     },
    // },

    // production: {
    //     client: 'postgresql',
    //     connection: {
    //         database: 'my_db',
    //         user: 'username',
    //         password: 'password',
    //     },
    //     pool: {
    //         min: 2,
    //         max: 10,
    //     },
    //     migrations: {
    //         tableName: 'knex_migrations',
    //     },
    // },

    // log: {
    //     warn(message: string) {
    //         return message;
    //     },
    //     error(message: string) {
    //         return message;
    //     },
    //     deprecate(message: string) {
    //         return message;
    //     },
    //     debug(message: string) {
    //         return message;
    //     },
    // },
};

module.exports = config;