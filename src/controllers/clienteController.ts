import { Request, Response } from 'express';
import { ClienteRepository } from '../repositories/clienteRepository';

const clienteRepo = new ClienteRepository();

// ─── GET /clientes ────────────────────────────────────────
export const getClientes = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const clientes = search
      ? await clienteRepo.searchByNombre(search as string)
      : await clienteRepo.findAll();

    res.json(clientes);
  } catch (error) {
    console.error('Error fetching clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── GET /clientes/:id ────────────────────────────────────
export const getClienteById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const cliente = await clienteRepo.findById(id);
    if (!cliente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    res.json(cliente);
  } catch (error) {
    console.error('Error fetching cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── POST /clientes ───────────────────────────────────────
export const createCliente = async (req: Request, res: Response) => {
  try {
    const { nombre, telefono, email, notas } = req.body;

    if (!nombre || nombre.trim().length < 2) {
      res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
      return;
    }

    const nuevo = await clienteRepo.create({
      nombre: nombre.trim(),
      telefono: telefono || null,
      email: email || null,
      notas: notas || null,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error creating cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── PATCH /clientes/:id ──────────────────────────────────
export const updateCliente = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    const existente = await clienteRepo.findById(id);
    if (!existente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    const actualizado = await clienteRepo.update(id, req.body);
    res.json(actualizado);
  } catch (error) {
    console.error('Error updating cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ─── DELETE /clientes/:id ─────────────────────────────────
export const deleteCliente = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    await clienteRepo.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting cliente:', error);
    // FK RESTRICT: si tiene turnos, no se puede borrar
    res.status(409).json({ error: 'No se puede eliminar: el cliente tiene turnos asociados' });
  }
};
