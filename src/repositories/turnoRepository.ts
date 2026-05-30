import { Pool, QueryResult } from 'pg';
import { Turno } from '../types/turno';
import { pool } from '../config/database';

export class TurnoRepository {
  async findAll(): Promise<Turno[]> {
    const result: QueryResult = await pool.query(
      'SELECT * FROM turnos ORDER BY fecha, hora'
    );
    return result.rows;
  }

  async create(turno: Omit<Turno, 'id' | 'created_at'>): Promise<Turno> {
    const result: QueryResult = await pool.query(
      'INSERT INTO turnos (nombre, servicio, fecha, hora) VALUES ($1, $2, $3, $4) RETURNING *',
      [turno.nombre, turno.servicio, turno.fecha, turno.hora]
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM turnos WHERE id = $1', [id]);
  }
}