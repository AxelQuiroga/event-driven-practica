import { Cliente } from '../types/cliente';
import { ClienteRepository } from '../repositories/clienteRepository';

export class ClienteService {
  private clienteRepository: ClienteRepository;

  constructor() {
    this.clienteRepository = new ClienteRepository();
  }

  async getAllClientes(): Promise<Cliente[]> {
    return this.clienteRepository.findAll();
  }

  async getClienteById(id: number): Promise<Cliente | undefined> {
    return this.clienteRepository.findById(id);
  }

  async searchClientesByNombre(nombre: string): Promise<Cliente[]> {
    return this.clienteRepository.searchByNombre(nombre);
  }

  async createCliente(clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    return this.clienteRepository.create(clienteData);
  }

  async updateCliente(id: number, data: Partial<Omit<Cliente, 'id' | 'created_at'>>): Promise<Cliente | undefined> {
    return this.clienteRepository.update(id, data);
  }

  async deleteCliente(id: number): Promise<void> {
    return this.clienteRepository.delete(id);
  }
}
