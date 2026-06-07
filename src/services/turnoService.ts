import { Turno, TurnoConDetalles, CrearTurnoDTO, EditarTurnoDTO, TurnoEstado } from '../types/turno';
import { TurnoRepository } from '../repositories/turnoRepository';
import { ServicioRepository } from '../repositories/servicioRepository';
import { ClienteRepository } from '../repositories/clienteRepository';
import { EventBus } from '../utils/eventBus';

const CAPACIDAD_POR_SLOT = 3; // 3 barberos

/**
 * Errores de negocio custom.
 * Se distinguen de errores de infraestructura (DB, red, etc.)
 */
export class TurnoError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'TurnoError';
  }
}

export class TurnoService {
  private turnoRepo: TurnoRepository;
  private servicioRepo: ServicioRepository;
  private clienteRepo: ClienteRepository;

  constructor() {
    this.turnoRepo = new TurnoRepository();
    this.servicioRepo = new ServicioRepository();
    this.clienteRepo = new ClienteRepository();
  }

  // ─── Queries ────────────────────────────────────────────

  async getAll(): Promise<TurnoConDetalles[]> {
    return this.turnoRepo.findAll();
  }

  async getByFecha(fecha: string): Promise<TurnoConDetalles[]> {
    return this.turnoRepo.findByFecha(fecha);
  }

  async getById(id: number): Promise<TurnoConDetalles> {
    const turno = await this.turnoRepo.findById(id);
    if (!turno) throw new TurnoError('Turno no encontrado', 404);
    return turno;
  }

  // ─── Crear turno ────────────────────────────────────────

  async create(dto: CrearTurnoDTO): Promise<Turno> {
    // 1. Validar que el cliente exista
    const cliente = await this.clienteRepo.findById(dto.cliente_id);
    if (!cliente) throw new TurnoError('Cliente no encontrado', 404);

    // 2. Validar que el servicio exista
    const servicio = await this.servicioRepo.findById(dto.servicio_id);
    if (!servicio) throw new TurnoError('Servicio no encontrado', 404);

    // 3. Validar hora (:00 o :30)
    this.validarHora(dto.hora);

    // 4. Validar capacidad del slot (max 3 barberos)
    const hayCapacidad = await this.turnoRepo.tieneCapacidad(dto.fecha, dto.hora);
    if (!hayCapacidad) {
      throw new TurnoError(
        `No hay disponibilidad a las ${dto.hora}. Elegí otro horario.`,
        409,
      );
    }

    // 5. Crear el turno con estado 'pending'
    const nuevoTurno = await this.turnoRepo.create({
      cliente_id: dto.cliente_id,
      servicio_id: dto.servicio_id,
      fecha: dto.fecha,
      hora: dto.hora,
      estado: 'pending',
      notas: dto.notas || null,
    });

    EventBus.getInstance().publish('turnoCreado', nuevoTurno);
    return nuevoTurno;
  }

  // ─── Editar turno ───────────────────────────────────────

  async update(id: number, dto: EditarTurnoDTO): Promise<Turno> {
    const existente = await this.turnoRepo.findById(id);
    if (!existente) throw new TurnoError('Turno no encontrado', 404);

    // No editar turnos finalizados o cancelados
    if (existente.estado === 'completed' || existente.estado === 'cancelled') {
      throw new TurnoError('No se puede editar un turno finalizado o cancelado', 400);
    }

    // Si cambia hora, validar capacidad
    const nuevaHora = dto.hora || existente.hora;
    const nuevaFecha = dto.fecha || existente.fecha;

    if (dto.hora || dto.fecha) {
      this.validarHora(nuevaHora);

      // Si cambia el slot, verificar capacidad en el nuevo
      if (dto.hora !== existente.hora || dto.fecha !== existente.fecha) {
        const hayCapacidad = await this.turnoRepo.tieneCapacidad(nuevaFecha, nuevaHora);
        if (!hayCapacidad) {
          throw new TurnoError(
            `No hay disponibilidad a las ${nuevaHora} el día ${nuevaFecha}.`,
            409,
          );
        }
      }
    }

    const turnoActualizado = await this.turnoRepo.update(id, {
      cliente_id: dto.cliente_id,
      servicio_id: dto.servicio_id,
      fecha: dto.fecha,
      hora: dto.hora,
      notas: dto.notas,
    });

    if (!turnoActualizado) throw new TurnoError('Error al actualizar turno', 500);

    EventBus.getInstance().publish('turnoEditado', turnoActualizado);
    return turnoActualizado;
  }

  // ─── Cambiar estado ─────────────────────────────────────

  async updateEstado(id: number, nuevoEstado: TurnoEstado): Promise<Turno> {
    const existente = await this.turnoRepo.findById(id);
    if (!existente) throw new TurnoError('Turno no encontrado', 404);

    // Validar transición
    if (!this.puedeTransicionar(existente.estado, nuevoEstado)) {
      throw new TurnoError(
        `No se puede cambiar de "${existente.estado}" a "${nuevoEstado}"`,
        400,
      );
    }

    const turno = await this.turnoRepo.updateEstado(id, nuevoEstado);
    if (!turno) throw new TurnoError('Error al actualizar estado', 500);

    EventBus.getInstance().publish('turnoEstadoCambiado', { id, anterior: existente.estado, nuevo: nuevoEstado });
    return turno;
  }

  // ─── Eliminar turno ─────────────────────────────────────

  async delete(id: number): Promise<void> {
    const existente = await this.turnoRepo.findById(id);
    if (!existente) throw new TurnoError('Turno no encontrado', 404);

    await this.turnoRepo.delete(id);
    EventBus.getInstance().publish('turnoEliminado', { id });
  }

  // ─── Helpers privados ───────────────────────────────────

  /**
   * Validar que la hora sea :00 o :30
   */
  private validarHora(hora: string): void {
    const [minutos] = hora.split(':').map(Number);
    if (minutos !== 0 && minutos !== 30) {
      throw new TurnoError('Los turnos son cada 30 minutos (ej: 09:00, 09:30, 10:00)', 400);
    }
  }

  /**
   * Máquina de estados simple: qué transiciones son válidas.
   *
   *   pending → completed | cancelled
   *   (no hay más, con 3 estados es acotado)
   */
  private puedeTransicionar(actual: string, nuevo: string): boolean {
    const transiciones: Record<string, string[]> = {
      pending: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };
    return transiciones[actual]?.includes(nuevo) ?? false;
  }
}
