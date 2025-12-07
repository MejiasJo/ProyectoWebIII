import express from 'express';
import * as usersService from '../services/usersService.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, allowRoles('admin'), async (req, res) => {
  try {
    const users = await usersService.getAll(req.query);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await usersService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

router.post('/', verifyToken, allowRoles('admin'), async (req, res) => {
  try {
    const newUser = await usersService.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message.includes('Faltan datos')) {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await usersService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'No hay datos para actualizar') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }
});

router.delete('/:id', verifyToken, allowRoles('admin'), async (req, res) => {
  try {
    const result = await usersService.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
});

export default router;