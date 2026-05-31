import { Request, Response } from 'express';
import { TurnoService } from '../services/turnoService';
import { CreateTurnoDTO } from '../schemas/turnoSchema';

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
    // Type-safe: req.body ahora tiene tipo CreateTurnoDTO gracias al middleware de Zod
    const turnoData = req.body as CreateTurnoDTO;
    
    // No necesitamos validar manualmente - el middleware de Zod ya lo hizo
    // Si llegamos aquí, los datos son válidos según el schema
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