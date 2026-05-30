import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'template1',
  password: process.env.DB_PASSWORD || 'documents26',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Test connection
pool.query('SELECT NOW()', (err: unknown, res: any) => {
  if (err instanceof Error) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

export const initDB = async () => {
  const queryText = `
    DROP TABLE IF EXISTS turnos;

    CREATE TABLE turnos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      servicio VARCHAR(100) NOT NULL,
      fecha DATE NOT NULL,
      hora TIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('✅ Base de datos sincronizada con tu repositorio con éxito.');
  } catch (error) {
    console.error('❌ Error al inicializar la tabla:', error);
  }
};