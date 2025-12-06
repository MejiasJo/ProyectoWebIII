import pool from './db.js';

export const getReporteHistorial = async () => {
  const query = `
    SELECT 
        a.idAnimal,
        a.nombre AS nombreAnimal,
        a.especie,
        a.raza,
        hm.diagnostico,
        hm.fechaDiagnostico,
        t.tratamiento,
        t.fechaInicio,
        t.fechaFin,
        t.dosis AS dosisTratamiento,
        u.name AS veterinario
    FROM Animal a
    LEFT JOIN HistorialMedico hm ON a.idAnimal = hm.idAnimal
    LEFT JOIN Tratamiento t ON a.idAnimal = t.idAnimal
    LEFT JOIN Users u ON hm.idVeterinario = u.id
    ORDER BY a.idAnimal, hm.fechaDiagnostico;
  `;

  const [rows] = await pool.query(query);
  return rows;
};