import { Router } from 'express';
import { validateSchema } from '../middlewares/validateSchema';
import { getTurnos, createTurno, deleteTurno } from '../controllers/turnoController';
import { createTurnoSchema } from '../schemas/turnoSchema';

const router = Router();

router.get('/turnos', getTurnos);
router.post('/turnos', validateSchema(createTurnoSchema), createTurno);
router.delete('/turnos/:id', deleteTurno);

export default router;