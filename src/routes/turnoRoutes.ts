import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema';
import {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  updateEstado,
  deleteTurno,
} from '../controllers/turnoController';
import { createTurnoSchema } from '../schemas/turnoSchema';

const router = Router();

router.get('/turnos', getTurnos);
router.get('/turnos/:id', getTurnoById);
router.post('/turnos', validateSchema(createTurnoSchema), createTurno);
router.patch('/turnos/:id', updateTurno);
router.patch('/turnos/:id/estado', updateEstado);
router.delete('/turnos/:id', deleteTurno);

export default router;
