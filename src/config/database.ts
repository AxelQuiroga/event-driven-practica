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