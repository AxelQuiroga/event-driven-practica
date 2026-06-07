import { Request, Response } from 'express';
import { ClienteService } from '../services/clienteService';

const clienteService = new ClienteService();

export const getAllClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await clienteService.getAllClientes();
    res.json(clientes);
  } catch (error) {
    console.error('Error fetching clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getClienteById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const clienteId = parseInt(id);
    
    if (isNaN(clienteId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    
    const cliente = await clienteService.getClienteById(clienteId);
    
    if (!cliente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }
    
    res.json(cliente);
  } catch (error) {
    console.error('Error fetching cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const searchClientes = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.query;
    
    if (!nombre || typeof nombre !== 'string') {
      res.status(400).json({ error: 'Parámetro nombre requerido' });
      return;
    }
    
    const clientes = await clienteService.searchClientesByNombre(nombre);
    res.json(clientes);
  } catch (error) {
    console.error('Error searching clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
