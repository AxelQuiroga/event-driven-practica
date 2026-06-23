import { Request, Response } from 'express';
import { TurnoService, TurnoError } from '../services/turnoService';

const turnoService = new TurnoService();

/**
 * Helper: manejar errores de negocio vs errores de infraestructura.
 */
function handleError(res: Response, error: unknown): void {
  if (error instanceof TurnoError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  console.error('Error inesperado:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
}

// ─── GET /turnos ──────────────────────────────────────────
export const getTurnos = async (req: Request, res: Response) => {
  try {
    const { fecha } = req.query;

    const turnos = fecha
      ? await turnoService.getByFecha(fecha as string)
      : await turnoService.getAll();

    res.json(turnos);
  } catch (error) {
    handleError(res, error);
  }
};

// ─── GET /turnos/:id ──────────────────────────────────────
export const getTurnoById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const turno = await turnoService.getById(id);
    res.json(turno);
  } catch (error) {
    handleError(res, error);
  }
};

// ─── GET /turnos/capacidad?fecha=YYYY-MM-DD ───────────────
export const getCapacidad = async (req: Request, res: Response) => {
  try {
    const { fecha } = req.query;
    if (!fecha || typeof fecha !== 'string') {
      res.status(400).json({ error: 'El parámetro "fecha" es obligatorio (YYYY-MM-DD)' });
      return;
    }

    const capacidad = await turnoService.getCapacidad(fecha);
    res.json(capacidad);
  } catch (error) {
    handleError(res, error);
  }
};

// ─── POST /turnos ─────────────────────────────────────────
export const createTurno = async (req: Request, res: Response) => {
  try {
    const { cliente_id, servicio_id, fecha, hora, notas } = req.body;
    const nuevoTurno = await turnoService.create({
      cliente_id,
      servicio_id,
      fecha,
      hora,
      notas,
    });
    res.status(201).json(nuevoTurno);
  } catch (error) {
    handleError(res, error);
  }
};

// ─── PATCH /turnos/:id ────────────────────────────────────
export const updateTurno = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const turno = await turnoService.update(id, req.body);
    res.json(turno);
  } catch (error) {
    handleError(res, error);
  }
};

// ─── PATCH /turnos/:id/estado ─────────────────────────────
export const updateEstado = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const { estado } = req.body;
    if (!estado) {
      res.status(400).json({ error: 'El campo "estado" es obligatorio' });
      return;
    }

    const turno = await turnoService.updateEstado(id, estado);
    res.json(turno);
  } catch (error) {
    handleError(res, error);
  }
};

// ─── DELETE /turnos/:id ───────────────────────────────────
export const deleteTurno = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    await turnoService.delete(id);
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};
