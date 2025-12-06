import express from 'express';
import { getAll, create, update, deleteById, getById } from '../services/citasService.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

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

// Obtener una cita por su ID
router.get('/id', async (req, res) => {
  try {
    const citas = await getById(req.params.id);
    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las citas por Id', error: error.message });
  }
});

// Crear una nueva cita
router.post('/', verifyToken, allowRoles('veterinario'), async (req, res ) => {
  try {
    const nuevaCita = await create(req.body);
    res.status(201).json(nuevaCita);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la cita', error: error.message });
  }
});

// Actualizar una cita existente
router.put('/:id', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const citaActualizada = await update(req.params.id, req.body);
    res.json(citaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cita', error: error.message });
  }
});

// Eliminar una cita por su ID
router.delete('/:id', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const result = await deleteById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cita', error: error.message });
  }
});

export default router;


