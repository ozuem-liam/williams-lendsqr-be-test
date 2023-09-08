import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function(table) {
        table.increments();
        table.uuid('user_id').notNullable().defaultTo(knex.fn.uuid());
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('phone_number').notNullable();
        table.string('email').notNullable();
        table.string('salt').notNullable();
        table.string('password').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('transactions', function(table) {
        table.increments();
        table.uuid('transaction_id').notNullable().defaultTo(knex.fn.uuid());
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users'); 
        table.integer('amount').notNullable();
        table.enum('transaction_type', ['transfer', 'fund']).notNullable().defaultTo('fund');
        table.string('description').notNullable();
        table.string('receiving_recipient').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('wallets', function(table) {
        table.increments();
        table.uuid('wallet_id').notNullable().defaultTo(knex.fn.uuid());
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users'); 
        table.integer('balance').notNullable().defaultTo(0);
        table.string('account_number').notNullable();
        table.boolean('active').notNullable().defaultTo(true);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallets').dropTable('transactions').dropTable('users');
}

