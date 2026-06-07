import { Router } from 'express';
import { getAllClientes, getClienteById, searchClientes } from '../controllers/clienteController';

const router = Router();

router.get('/clientes', getAllClientes);
router.get('/clientes/:id', getClienteById);
router.get('/clientes/search', searchClientes);

export default router;
