import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('turnos', (table) => {
    table.increments('id').primary(); // SERIAL PRIMARY KEY
    table.string('nombre', 100).notNullable();
    table.string('servicio', 100).notNullable();
    table.date('fecha').notNullable();
    table.time('hora').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('turnos');
}
