import { Router } from 'express';
import { getAllServicios, getServicioById } from '../controllers/servicioController';

const router = Router();

router.get('/servicios', getAllServicios);
router.get('/servicios/:id', getServicioById);

export default router;
