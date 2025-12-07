import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';
import { getReporteHistorial } from '../services/reporteService.js';

const router = express.Router();

router.get('/historial', verifyToken, allowRoles('veterinario'), async (req, res) => {
  try {
    const reporte = await getReporteHistorial();
    res.json({
      message: 'Reporte generado correctamente',
      reporte
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      message: 'Error al obtener el reporte',
      error: error.message
    });
  }
});

export default router;