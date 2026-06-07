import { Servicio } from '../types/servicio';
import { db } from '../config/database';

export class ServicioRepository {
  /**
   * Devuelve todos los servicios activos.
   */
  async findAll(): Promise<Servicio[]> {
    return db<Servicio>('servicios')
      .where('activo', true)
      .orderBy('nombre');
  }

  /**
   * Busca un servicio por ID.
   */
  async findById(id: number): Promise<Servicio | undefined> {
    return db<Servicio>('servicios')
      .where('id', id)
      .first();
  }

  /**
   * Busca un servicio por nombre exacto.
   */
  async findByNombre(nombre: string): Promise<Servicio | undefined> {
    return db<Servicio>('servicios')
      .where('nombre', nombre)
      .first();
  }
}
