import express from 'express';
import { login } from '../services/authService.js';
import rateLimit from 'express-rate-limit';
import { logEvent } from '../utils/logger.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3, 
  message: {
    error: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 1 minuto.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});


router.post('/login', loginLimiter,async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await login(username, password);
    logEvent(`LOGIN OK: ${username}`);
    res.json(result);
  } catch (err) {
    logEvent(`LOGIN FAIL: ${username}`);
    res.status(401).json({ error: err.message });
  }
});

export default router;