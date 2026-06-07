import { Request, Response } from 'express';
import { ServicioRepository } from '../repositories/servicioRepository';

const servicioRepo = new ServicioRepository();

// ─── GET /servicios ───────────────────────────────────────
export const getServicios = async (_req: Request, res: Response) => {
  try {
    const servicios = await servicioRepo.findAll();
    res.json(servicios);
  } catch (error) {
    console.error('Error fetching servicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── GET /servicios/:id ───────────────────────────────────
export const getServicioById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const servicio = await servicioRepo.findById(id);
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
