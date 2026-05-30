import { Request, Response } from 'express';
import { TurnoService } from '../services/turnoService';

const turnoService = new TurnoService();

export const getTurnos = async (req: Request, res: Response) => {
  try {
    const turnos = await turnoService.getAllTurnos();
    res.json(turnos);
  } catch (error) {
    console.error('Error fetching turnos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createTurno = async (req: Request, res: Response) => {
  try {
    const { nombre, servicio, fecha, hora } = req.body;
    
    if (!nombre || !servicio || !fecha || !hora) {
      res.status(400).json({ error: 'Todos los campos son requeridos' });
      return;
    }
    
    const turnoData = { nombre, servicio, fecha, hora };
    const nuevoTurno = await turnoService.createTurno(turnoData);
    
    res.status(201).json(nuevoTurno);
  } catch (error) {
    console.error('Error creating turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteTurno = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const turnoId = parseInt(id);
    
    if (isNaN(turnoId)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }
    
    await turnoService.deleteTurno(turnoId);
    res.json({ message: 'Turno eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting turno:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};