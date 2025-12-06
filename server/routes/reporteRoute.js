import express from 'express';
import { getReporteHistorial } from '../services/reporteService.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { allowRoles } from '../middlewares/allowRoles.js';
import { logEvent } from '../middlewares/logEvent.js';

const router = express.Router();

router.get('/historial', verifyToken, allowRoles('veterinario'), async (req, res) => {
    try {
      logEvent(`Reporte solicitado por el veterinario ID=${req.user.id}`);
      const reporte = await getReporteHistorial();
      res.json({
        message: 'Reporte generado correctamente',
        reporte
      });

    } catch (error) {
      console.error('Error al generar reporte:', error);
      res.status(500).json({
        error: 'Error al generar el reporte',
        detalle: error.message
      });
    }
  }
);

export default router;
