import express from 'express';
import { getAll, create, update, deleteById } from '../services/historialService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filtros = req.query;
    const historial = await getAll(filtros);
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial médico', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoRegistro = await create(req.body);
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el diagnóstico', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizado = await update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
});

export default router;
