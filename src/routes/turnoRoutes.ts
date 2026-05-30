import { Router } from 'express';
import { getTurnos, createTurno, deleteTurno } from '../controllers/turnoController';

const router = Router();

router.get('/turnos', getTurnos);
router.post('/turnos', createTurno);
router.delete('/turnos/:id', deleteTurno);

export default router;