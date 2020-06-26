import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
};

export async function down(knex: Knex) {
    // Sempre deve fazer exatamente o contrario do metodo up - no caso aqui deletar a tabela
    return knex.schema.dropTable('items');
};