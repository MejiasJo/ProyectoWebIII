import pool from './db.js';

export const getReporteHistorial = async () => {
  const query = `
    SELECT 
        a.idAnimal,
        a.nombre AS nombreAnimal,
        a.especie,
        a.raza,
        hm.idDiagnosticoHistorial,
        hm.diagnostico,
        hm.fechaDiagnostico,
        t.idTratamiento,
        t.tratamiento,
        t.fechaInicio,
        t.fechaFin,
        t.dosis AS dosisTratamiento,
        t.instrucciones,
        u.name AS veterinario
    FROM HistorialMedico hm
    JOIN Animal a ON hm.idAnimal = a.idAnimal
    LEFT JOIN Tratamiento t ON hm.idTratamiento = t.idTratamiento
    LEFT JOIN Users u ON hm.idVeterinario = u.id
    ORDER BY a.idAnimal, hm.fechaDiagnostico, t.fechaInicio;
  `;

  const [rows] = await pool.query(query);
  return rows;
};
