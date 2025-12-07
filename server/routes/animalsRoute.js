// routes/animalsRouter.js
import express from 'express';
import * as animalsService from '../services/animalsService.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();


router.get('/', verifyToken, async (req, res) => {
  try {
    const { role, id } = req.user;  

    if (role === 'admin' || role === 'veterinario') {
      const animales = await animalsService.getAll();  
      return res.json(animales);
    }
    if (role === 'cliente') {
      const animales = await animalsService.getAll({ userId: id }); 
      return res.json(animales);
    }
    res.status(403).json({ error: 'Acceso no autorizado' });
  } catch (err) {
    console.error('Error obteniendo animales:', err);
    res.status(500).json({ error: 'Error al obtener animales' });
  }
});


// Obtener animales con filtros dinámicos 
router.get("/filtros",verifyToken, allowRoles('admin', 'veterinario'),async (req, res) => {
  try {
    const filters = req.query;  
    const animales = await animalsService.getDynamic(filters);  
    res.json(animales);  
  } catch (error) {
    console.error("Error obteniendo animales:", error);
    res.status(500).json({ error: "Error al obtener los animales" });
  }
});

// Obtener un animal por ID
router.get('/:id',verifyToken, allowRoles('admin', 'veterinario'), async (req, res) => {
  try {
    const animal = await animalsService.getById(req.params.id);
    if (!animal)
      return res.status(404).json({ error: 'Animal no encontrado' });

    res.json(animal);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener animal' });
  }
});

// Crear animal
router.post('/',verifyToken, allowRoles('admin', 'veterinario'), async (req, res) => {
  try {
    const nuevoAnimal = await animalsService.create(req.body);
    res.status(201).json(nuevoAnimal);
  } catch (err) {
    if (err.message.includes('Faltan datos')) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al crear animal' });
  }
});

// Actualizar animal
router.put('/:id',verifyToken, allowRoles('admin', 'veterinario'), async (req, res) => {
  try {
    const actualizado = await animalsService.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    if (err.message === 'Animal not found' || err.message === 'No hay datos para actualizar') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al actualizar animal' });
  }
});

// Eliminar animal
router.delete('/:id',verifyToken, allowRoles('admin', 'veterinario'), async (req, res) => {
  try {
    const result = await animalsService.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Animal not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error al eliminar animal' });
  }
});

export default router;
