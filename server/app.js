import express from 'express';
import usersRoutes from './routes/usersRoutes.js';
import citaRoutes from './routes/citasRoute.js';  
import historialRoutes from './routes/historialRoute.js';
import animalsRoutes from './routes/animalsRoute.js';
import tratamientoRoutes from './routes/tratamientoRoute.js';
import authRoute from './routes/authRoute.js';
import pool from './services/db.js';


const app = express();
const PORT = 4000;

app.use(express.json());


// Rutas
app.use('/api/auth', authRoute);
app.use('/api/usuarios', usersRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/animales', animalsRoutes);
app.use('/api/tratamientos', tratamientoRoutes);

// Iniciar el servidor
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a MariaDB');
    connection.release();
  } catch (err) {
    console.error('Error conectando a la DB:', err);
  }
})();

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo perfectisimo 😘👌 en http://localhost:${PORT}`);
});