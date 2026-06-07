import { Request, Response } from 'express';
import { ServicioService } from '../services/servicioService';

const servicioService = new ServicioService();

export const getAllServicios = async (req: Request, res: Response) => {
  try {
    const servicios = await servicioService.getAllServicios();
    res.json(servicios);
  } catch (error) {
    console.error('Error fetching servicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getServicioById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const servicioId = parseInt(id);
    
    if (isNaN(servicioId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    
    const servicio = await servicioService.getServicioById(servicioId);
    
    if (!servicio) {
      res.status(404).json({ error: 'Servicio no encontrado' });
      return;
    }
    
    res.json(servicio);
  } catch (error) {
    console.error('Error fetching servicio:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
