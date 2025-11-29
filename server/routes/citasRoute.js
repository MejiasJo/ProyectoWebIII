import express from 'express';
import { getAll, create, update, deleteById } from '../services/citasService.js';

const router = express.Router();

// Obtener todas las citas 
router.get('/', async (req, res) => {
  try {
    const filtros = req.query; 
    const citas = await getAll(filtros);
    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas', error: error.message });
  }
});

// Crear una nueva cita
router.post('/', async (req, res) => {
  try {
    const nuevaCita = await create(req.body);
    res.status(201).json(nuevaCita);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cita', error: error.message });
  }
});

// Actualizar una cita existente
router.put('/:id', async (req, res) => {
  try {
    const citaActualizada = await update(req.params.id, req.body);
    res.json(citaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cita', error: error.message });
  }
});

// Eliminar una cita por su ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cita', error: error.message });
  }
});

export default router;
