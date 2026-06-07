import { Router } from 'express';
import {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} from '../controllers/clienteController';

const router = Router();

router.get('/clientes', getClientes);
router.get('/clientes/:id', getClienteById);
router.post('/clientes', createCliente);
router.patch('/clientes/:id', updateCliente);
router.delete('/clientes/:id', deleteCliente);

export default router;
