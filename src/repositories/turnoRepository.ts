import { Turno, TurnoConDetalles } from '../types/turno';
import { db } from '../config/database';

export class TurnoRepository {
  /**
   * Devuelve todos los turnos con datos del cliente y servicio.
   * Ordenados por fecha y hora.
   */
  async findAll(): Promise<TurnoConDetalles[]> {
    return db('turnos')
      .select(
        'turnos.*',
        'clientes.nombre as cliente_nombre',
        'servicios.nombre as servicio_nombre',
        'servicios.precio as servicio_precio'
      )
      .join('clientes', 'turnos.cliente_id', 'clientes.id')
      .join('servicios', 'turnos.servicio_id', 'servicios.id')
      .orderBy([
        { column: 'turnos.fecha', order: 'desc' },
        { column: 'turnos.hora', order: 'desc' },
      ]);
  }

  /**
   * Devuelve turnos de una fecha específica.
   */
  async findByFecha(fecha: string): Promise<TurnoConDetalles[]> {
    return db('turnos')
      .select(
        'turnos.*',
        'clientes.nombre as cliente_nombre',
        'servicios.nombre as servicio_nombre',
        'servicios.precio as servicio_precio'
      )
      .join('clientes', 'turnos.cliente_id', 'clientes.id')
      .join('servicios', 'turnos.servicio_id', 'servicios.id')
      .where('turnos.fecha', fecha)
      .orderBy('turnos.hora');
  }

  /**
   * Busca un turno por ID con detalles.
   */
  async findById(id: number): Promise<TurnoConDetalles | undefined> {
    return db('turnos')
      .select(
        'turnos.*',
        'clientes.nombre as cliente_nombre',
        'servicios.nombre as servicio_nombre',
        'servicios.precio as servicio_precio'
      )
      .join('clientes', 'turnos.cliente_id', 'clientes.id')
      .join('servicios', 'turnos.servicio_id', 'servicios.id')
      .where('turnos.id', id)
      .first();
  }

  /**
   * Cuenta cuántos turnos activos hay en un slot horario específico.
   *
   * "Activos" = todos menos cancelled y no_show (no tenemos no_show todavía,
   * pero lo ponemos por si lo agregamos después).
   *
   * @returns cantidad de turnos activos en ese slot
   */
  async contarTurnosEnSlot(fecha: string, hora: string): Promise<number> {
    const [resultado] = await db('turnos')
      .where({ fecha, hora })
      .whereNotIn('estado', ['cancelled'])
      .count('id as total');

    return Number(resultado?.total ?? 0);
  }

  /**
   * Verifica si un slot tiene capacidad (menos de 3 turnos activos).
   */
  async tieneCapacidad(fecha: string, hora: string): Promise<boolean> {
    const total = await this.contarTurnosEnSlot(fecha, hora);
    return total < 3;
  }

  /**
   * Devuelve la capacidad de TODOS los slots de un día.
   * Útil para mostrar la grilla de disponibilidad.
   */
  async getCapacidadPorDia(fecha: string): Promise<{ hora: string; ocupados: number; total: number }[]> {
    // Todos los slots posibles: 09:00 a 19:00 cada 30 min
    const slots: string[] = [];
    for (let h = 9; h <= 19; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
      if (h < 19) slots.push(`${String(h).padStart(2, '0')}:30`);
    }

    // Contar turnos activos por slot
    // IMPORTANTE: PostgreSQL devuelve TIME con segundos ("10:00:00") pero
    // nosotros en el frontend manejamos "10:00". Si no formateamos, el Map
    // key "10:00:00" nunca matchea con nuestro slot "10:00" → TODO 0.
    //
    // Usamos to_char() en SQL para que tanto GROUP BY como SELECT devuelvan
    // "HH:MI" sin segundos, y así matchean con los slots del frontend.
    const conteo = await db('turnos')
      .where('fecha', fecha)
      .whereNotIn('estado', ['cancelled'])
      .groupByRaw("to_char(hora, 'HH24:MI')")
      .select(db.raw("to_char(hora, 'HH24:MI') as hora"))
      .count('id as ocupados');

    const conteoMap = new Map<string, number>(
      conteo.map((c) => [c.hora as string, Number(c.ocupados)])
    );

    return slots.map((hora) => ({
      hora,
      ocupados: conteoMap.get(hora) ?? 0,
      total: 3,
    }));
  }

  /**
   * Crea un nuevo turno y lo devuelve con datos del cliente y servicio.
   */
  async create(turno: {
    cliente_id: number;
    servicio_id: number;
    fecha: string;
    hora: string;
    notas: string | null;
  }): Promise<TurnoConDetalles> {
    const [nuevo] = await db('turnos')
      .insert({
        cliente_id: turno.cliente_id,
        servicio_id: turno.servicio_id,
        fecha: turno.fecha,
        hora: turno.hora,
        notas: turno.notas,
      })
      .returning('*');

    // Devolver con datos joinados
    return this.findById(nuevo.id) as Promise<TurnoConDetalles>;
  }

  /**
   * Actualiza un turno existente.
   * Útil para editar hora, servicio, cliente, etc.
   */
  async update(id: number, data: {
    cliente_id?: number;
    servicio_id?: number;
    fecha?: string;
    hora?: string;
    notas?: string;
  }): Promise<Turno | undefined> {
    const [actualizado] = await db<Turno>('turnos')
      .where('id', id)
      .update({
        ...data,
        updated_at: db.fn.now(),
      })
      .returning('*');

    return actualizado;
  }

  /**
   * Cambia el estado de un turno.
   */
  async updateEstado(id: number, estado: string): Promise<Turno | undefined> {
    const [actualizado] = await db<Turno>('turnos')
      .where('id', id)
      .update({
        estado: db.raw('?', [estado]),
        updated_at: db.fn.now(),
      })
      .returning('*');

    return actualizado;
  }

  /**
   * Elimina un turno.
   */
  async delete(id: number): Promise<void> {
    await db<Turno>('turnos')
      .where('id', id)
      .del();
  }
}
