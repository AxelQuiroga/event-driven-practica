import { Cliente } from '../types/cliente';
import { db } from '../config/database';

export class ClienteRepository {
  /**
   * Devuelve todos los clientes, ordenados por nombre.
   */
  async findAll(): Promise<Cliente[]> {
    return db<Cliente>('clientes')
      .orderBy('nombre');
  }

  /**
   * Busca un cliente por ID.
   */
  async findById(id: number): Promise<Cliente | undefined> {
    return db<Cliente>('clientes')
      .where('id', id)
      .first();
  }

  /**
   * Busca clientes por nombre (búsqueda parcial, case-insensitive).
   */
  async searchByNombre(nombre: string): Promise<Cliente[]> {
    return db<Cliente>('clientes')
      .where('nombre', 'ilike', `%${nombre}%`)
      .orderBy('nombre')
      .limit(10);
  }

  /**
   * Busca un cliente por teléfono.
   */
  async findByTelefono(telefono: string): Promise<Cliente | undefined> {
    return db<Cliente>('clientes')
      .where('telefono', telefono)
      .first();
  }

  /**
   * Crea un nuevo cliente.
   */
  async create(cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const [nuevo] = await db<Cliente>('clientes')
      .insert({
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email,
        notas: cliente.notas,
      })
      .returning('*');

    return nuevo;
  }

  /**
   * Actualiza un cliente existente.
   */
  async update(id: number, data: Partial<Omit<Cliente, 'id' | 'created_at'>>): Promise<Cliente | undefined> {
    const [actualizado] = await db<Cliente>('clientes')
      .where('id', id)
      .update({
        ...data,
        updated_at: db.fn.now(),
      })
      .returning('*');

    return actualizado;
  }

  /**
   * Elimina un cliente.
   * NOTA: Falla si tiene turnos asociados (FK RESTRICT).
   */
  async delete(id: number): Promise<void> {
    await db<Cliente>('clientes')
      .where('id', id)
      .del();
  }
}
