import express from 'express';
import citaRoutes from './routes/citasRoute.js';  

const app = express();
const PORT = 4000;

app.use(express.json());


// Rutas
app.use('/api/citas', citaRoutes);

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