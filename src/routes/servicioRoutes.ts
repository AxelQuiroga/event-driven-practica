import { Router } from 'express';
import { getServicios, getServicioById } from '../controllers/servicioController';

const router = Router();

router.get('/servicios', getServicios);
router.get('/servicios/:id', getServicioById);

export default router;
