import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';
import { getAll, create, update, deleteById } from '../services/historialService.js';

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const filtros = req.query;
    const { role, id } = req.user;
    let historial;
    if (role === 'admin' || role === 'veterinario') {
      historial = await getAll(filtros, req.user);
    }
    if (role === 'cliente') {
      historial = await getAll(filtros, req.user);
    }

    res.json(historial);

  } catch (error) {
    console.error('Error al obtener el historial médico:', error);
    res.status(500).json({
      message: 'Error al obtener el historial médico',
      error: error.message
    });
  }
});

router.post('/', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const nuevoRegistro = await create(req.body);
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el diagnóstico', error: error.message });
  }
});

router.put('/:id', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const actualizado = await update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
});

router.delete('/:id', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const result = await deleteById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
});

export default router;
