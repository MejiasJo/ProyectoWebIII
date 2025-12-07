import pool from './db.js';

export const create = async ({ idVeterinario, idAnimal, idTratamiento, fechaDiagnostico, diagnostico }) => {
  if (!idVeterinario || !idAnimal || !fechaDiagnostico || !idTratamiento) {
    throw new Error('Faltan campos requeridos');
  }
  const [result] = await pool.execute(
    `INSERT INTO HistorialMedico 
    (idVeterinario, idAnimal, fechaDiagnostico, diagnostico, idTratamiento)
    VALUES (?, ?, ?, ?, ?)`,
    [idVeterinario, idAnimal, fechaDiagnostico, diagnostico, idTratamiento]
  );

  const [newRegistro] = await pool.execute(
    'SELECT * FROM HistorialMedico WHERE idDiagnosticoHistorial = ?',
    [result.insertId]
  );

  return newRegistro[0];
};

export const getAll = async (filters = {}, user) => {
  const { idAnimal, idVeterinario, fechaDiagnostico, idTratamiento } = filters;
  let where = [];
  const params = [];
  let query = 'FROM HistorialMedico h ';

  if (user.role === 'cliente') {
    query += 'JOIN Animal a ON h.idAnimal = a.idAnimal ';
    where.push('a.idCliente = ?');
    params.push(user.id);
  }
  if (idAnimal) {
    where.push('h.idAnimal = ?');
    params.push(idAnimal);
  }
  if (idVeterinario) {
    where.push('h.idVeterinario = ?');
    params.push(idVeterinario);
  }
  if (fechaDiagnostico) {
    where.push('h.fechaDiagnostico = ?');
    params.push(fechaDiagnostico);
  }
  if (idTratamiento) {
    where.push('h.idTratamiento = ?');
    params.push(idTratamiento);
  }

  if (where.length > 0) {
    query += 'WHERE ' + where.join(' AND ');
  }

  query += ' ORDER BY h.fechaDiagnostico DESC';

  const sql = `SELECT h.* ${query}`;

  const [rows] = await pool.execute(sql, params);
  return rows;
};


export const update = async (idDiagnosticoHistorial, updates) => {
  const { diagnostico, fechaDiagnostico } = updates;

  if (!diagnostico && !fechaDiagnostico) {
    throw new Error('Se debe proporcionar al menos un campo para actualizar (diagnóstico o fecha)');
  }

  let query = 'UPDATE HistorialMedico SET ';
  const params = [];

  if (diagnostico !== undefined) {
    query += 'diagnostico = ?, ';
    params.push(diagnostico);
  }
  if (fechaDiagnostico !== undefined) {
    query += 'fechaDiagnostico = ?, ';
    params.push(fechaDiagnostico);
  }

  query = query.slice(0, -2);
  
  query += ' WHERE idDiagnosticoHistorial = ?';
  params.push(idDiagnosticoHistorial);

  const [result] = await pool.execute(query, params);

  if (result.affectedRows === 0) {
    throw new Error('Diagnóstico no encontrado');
  }

  const [updated] = await pool.execute(
    'SELECT * FROM HistorialMedico WHERE idDiagnosticoHistorial = ?',
    [idDiagnosticoHistorial]
  );

  return updated[0];
};


export const deleteById = async (idDiagnosticoHistorial) => {
  const [result] = await pool.execute(
    'DELETE FROM HistorialMedico WHERE idDiagnosticoHistorial = ?',
    [idDiagnosticoHistorial]
  );

  if (result.affectedRows === 0) {
    throw new Error('Diagnóstico no encontrado');
  }

  return { message: 'Diagnóstico eliminado correctamente' };
};
