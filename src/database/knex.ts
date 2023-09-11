// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("./knexfile");
import knex from 'knex';

const environment = process.env.APP_ENV || 'development';
const nconfig = config[environment];

const knexapp = knex(nconfig);
export default knexapp;