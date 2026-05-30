import { Turno } from '../types/turno';
import { TurnoRepository } from '../repositories/turnoRepository';
import { EventBus } from '../utils/eventBus';

export class TurnoService {
  private turnoRepository: TurnoRepository;

  constructor() {
    this.turnoRepository = new TurnoRepository();
  }

  async getAllTurnos(): Promise<Turno[]> {
    return this.turnoRepository.findAll();
  }

  async createTurno(turnoData: Omit<Turno, 'id' | 'created_at'>): Promise<Turno> {
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