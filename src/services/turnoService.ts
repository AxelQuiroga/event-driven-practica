import { Turno, CreateTurnoInput } from '../types/turno';
import { TurnoRepository } from '../repositories/turnoRepository';
import { ClienteRepository } from '../repositories/clienteRepository';
import { ServicioRepository } from '../repositories/servicioRepository';
import { EventBus } from '../utils/eventBus';

export class TurnoService {
  private turnoRepository: TurnoRepository;
  private clienteRepository: ClienteRepository;
  private servicioRepository: ServicioRepository;

  constructor() {
    this.turnoRepository = new TurnoRepository();
    this.clienteRepository = new ClienteRepository();
    this.servicioRepository = new ServicioRepository();
  }

  async getAllTurnos(): Promise<Turno[]> {
    return this.turnoRepository.findAll();
  }

  async createTurno(turnoData: CreateTurnoInput): Promise<Turno> {
    // Validar que el cliente existe (SRP: service maneja lógica de negocio)
    const cliente = await this.clienteRepository.findById(turnoData.cliente_id);
    if (!cliente) {
      throw new Error('El cliente no existe');
    }

    // Validar que el servicio existe y está activo
    const servicio = await this.servicioRepository.findById(turnoData.servicio_id);
    if (!servicio) {
      throw new Error('El servicio no existe');
    }
    if (!servicio.activo) {
      throw new Error('El servicio no está activo');
    }

    const nuevoTurno = await this.turnoRepository.create(turnoData);
    
    // Publicar evento
    EventBus.getInstance().publish('turnoCreado', nuevoTurno);
    
    return nuevoTurno;
  }

  async deleteTurno(id: number): Promise<void> {
    await this.turnoRepository.delete(id);
    
    // Publicar evento
    EventBus.getInstance().publish('turnoEliminado', { id });
  }
}