import express from 'express';
import * as tratamientoService from '../services/tratamientoService.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const treatment = await tratamientoService.getAll();
    res.json(treatment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tratamientos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const treatment = await tratamientoService.getById(req.params.id);
    if (!treatment) return res.status(404).json({ error: 'Tratamiento no encontrado' });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener tratamiento' });
  }
});

router.post('/', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const newTreatment = await tratamientoService.create(req.body);
    res.status(201).json(newTreatment);
  } catch (err) {
    if (err.message.includes('Faltan datos')) {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Error al crear tratamiento' });
    }
  }
});

router.put('/:id', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const updated = await tratamientoService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Treatment not found' || err.message === 'No hay datos para actualizar') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar Tratamiento' });
    }
  }
});

router.delete('/:id', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const result = await tratamientoService.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Treatment not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar tratamiento' });
    }
  }
});

export default router;