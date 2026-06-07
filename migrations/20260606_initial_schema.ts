import type { Knex } from 'knex';

/**
 * Migración inicial: schema completo de la peluquería.
 *
 * - servicios: catálogo (nombre + precio)
 * - clientes: entidad real (nombre, teléfono, email, notas)
 * - turnos: con FK a clientes y servicios, estado, notas
 */
export async function up(knex: Knex): Promise<void> {
  // 1. Servicios
  await knex.schema.createTable('servicios', (table) => {
    table.increments('id').primary();
    table.string('nombre', 100).notNullable().unique();
    table.decimal('precio', 10, 2);
    table.boolean('activo').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 2. Clientes
  await knex.schema.createTable('clientes', (table) => {
    table.increments('id').primary();
    table.string('nombre', 100).notNullable();
    table.string('telefono', 20);
    table.string('email', 150);
    table.text('notas');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index('nombre');
  });

  // 3. Turnos
  await knex.schema.createTable('turnos', (table) => {
    table.increments('id').primary();
    table.integer('cliente_id').notNullable().references('id').inTable('clientes').onDelete('RESTRICT');
    table.integer('servicio_id').notNullable().references('id').inTable('servicios').onDelete('RESTRICT');
    table.date('fecha').notNullable();
    table.time('hora').notNullable();
    table.string('estado', 20).notNullable().defaultTo('pending');
    table.text('notas');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index(['fecha', 'hora']);
    table.index('cliente_id');
    table.index('estado');
  });

  // CHECKs
  await knex.raw(`
    ALTER TABLE turnos ADD CONSTRAINT chk_estado
    CHECK (estado IN ('pending', 'completed', 'cancelled'))
  `);

  await knex.raw(`
    ALTER TABLE turnos ADD CONSTRAINT chk_hora_media_hora
    CHECK (EXTRACT(MINUTE FROM hora) IN (0, 30))
  `);

  // 4. Servicios iniciales
  await knex('servicios').insert([
    { nombre: 'Corte de pelo',  precio: 3000 },
    { nombre: 'Corte y barba',  precio: 4500 },
    { nombre: 'Barba',          precio: 2000 },
    { nombre: 'Tinte',          precio: 8000 },
    { nombre: 'Lavado',         precio: 1500 },
    { nombre: 'Peinado',        precio: 5000 },
    { nombre: 'Corte infantil', precio: 2500 },
    { nombre: 'Alisado',        precio: 15000 },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('turnos');
  await knex.schema.dropTableIfExists('clientes');
  await knex.schema.dropTableIfExists('servicios');
}
