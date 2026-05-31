import { Turno } from '../types/turno';
import { db } from '../config/database';

export class TurnoRepository {
  async findAll(): Promise<Turno[]> {
    return db<Turno>('turnos')
      .select('*')
      .orderBy([
        { column: 'fecha' },
        { column: 'hora' },
      ]);
  }

  async create(turno: Omit<Turno, 'id' | 'created_at'>): Promise<Turno> {
    const [nuevo] = await db<Turno>('turnos')
      .insert({
        nombre: turno.nombre,
        servicio: turno.servicio,
        fecha: turno.fecha,
        hora: turno.hora,
      })
      .returning('*');

    return nuevo;
  }

  async delete(id: number): Promise<void> {
    await db<Turno>('turnos')
      .where('id', id)
      .del();
  }
}
