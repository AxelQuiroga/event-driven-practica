import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.DB_USER!,
  host: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  password: process.env.DB_PASSWORD!,
  port: parseInt(process.env.DB_PORT!),
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
    CREATE TABLE IF NOT EXISTS turnos (
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
    console.log('✅ Base de datos verificada/creada con éxito.');
  } catch (error) {
    console.error('❌ Error al inicializar la tabla:', error);
  }
};