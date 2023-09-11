import { Knex } from 'knex';

const LogTypes = ['request', 'response', 'error', 'info', 'debug'];
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('app_logs', function (table) {
        table.increments();
        table.string('level').notNullable();
        table.enum('type', LogTypes).notNullable().defaultTo('error');
        table.string('app_name').notNullable();
        table.string('log_id').notNullable();
        table.string('code').notNullable();
        table.string('message').notNullable();
        table.json('data').notNullable();
        table.string('time').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('app_logs');
}
