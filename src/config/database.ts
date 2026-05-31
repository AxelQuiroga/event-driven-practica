import knex, { Knex } from 'knex';
import path from 'path';

// Instancia global de Knex — conexión a PostgreSQL
export const db: Knex = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'template1',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join(__dirname, '../../migrations'),
    extension: 'ts',
  },
});

// Inicializa la DB ejecutando migraciones pendientes
export const initDB = async (): Promise<void> => {
  try {
    const [batchNo, log] = await db.migrate.latest();
    if (log.length === 0) {
      console.log('✅ Base de datos al día (sin migraciones pendientes).');
    } else {
      console.log(`✅ Migraciones ejecutadas (batch ${batchNo}):`, log);
    }
  } catch (error) {
    console.error('❌ Error al ejecutar migraciones:', error);
    throw error; // Que el server.ts sepa que falló
  }
};
