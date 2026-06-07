import { Servicio } from '../types/servicio';
import { ServicioRepository } from '../repositories/servicioRepository';

export class ServicioService {
  private servicioRepository: ServicioRepository;

  constructor() {
    this.servicioRepository = new ServicioRepository();
  }

  async getAllServicios(): Promise<Servicio[]> {
    return this.servicioRepository.findAll();
  }

  async getServicioById(id: number): Promise<Servicio | undefined> {
    return this.servicioRepository.findById(id);
  }

  async getServicioByNombre(nombre: string): Promise<Servicio | undefined> {
    return this.servicioRepository.findByNombre(nombre);
  }
}
