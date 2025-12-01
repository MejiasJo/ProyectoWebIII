import pool from './db.js';

export const create = async ({ idVeterinario, idAnimal, fechaDiagnostico, diagnostico, medicamentos, dosis, cantidad }) => {
  if (!idVeterinario || !idAnimal || !fechaDiagnostico) {
    throw new Error('Faltan campos requeridos');
  }

  const [result] = await pool.execute(
    `INSERT INTO HistorialMedico 
    (idVeterinario, idAnimal, fechaDiagnostico, diagnostico, medicamentos, dosis, cantidad)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [idVeterinario, idAnimal, fechaDiagnostico, diagnostico, medicamentos, dosis, cantidad]
  );

  const [newRegistro] = await pool.execute(
    'SELECT * FROM HistorialMedico WHERE idDiagnosticoHistorial = ?',
    [result.insertId]
  );

  return newRegistro[0];
};

export const getAll = async (filters = {}) => {
  const { idAnimal, idVeterinario, fechaDiagnostico } = filters;
  let query = 'SELECT * FROM HistorialMedico';
  const where = [];
  const params = [];

  if (idAnimal !== undefined) {
    where.push('idAnimal = ?');
    params.push(idAnimal);
  }
  if (idVeterinario !== undefined) {
    where.push('idVeterinario = ?');
    params.push(idVeterinario);
  }
  if (fechaDiagnostico !== undefined) {
    where.push('fechaDiagnostico = ?');
    params.push(fechaDiagnostico);
  }

  if (where.length > 0) {
    query += ' WHERE ' + where.join(' AND ');
  }

  query += ' ORDER BY fechaDiagnostico DESC';

  const [rows] = await pool.execute(query, params);
  return rows;
};

export const update = async (idDiagnosticoHistorial, updates) => {
  const { idVeterinario, idAnimal, fechaDiagnostico, diagnostico, medicamentos, dosis, cantidad } = updates;

  let query = 'UPDATE HistorialMedico SET ';
  const params = [];

  if (idVeterinario !== undefined) {
    query += 'idVeterinario = ?, ';
    params.push(idVeterinario);
  }
  if (idAnimal !== undefined) {
    query += 'idAnimal = ?, ';
    params.push(idAnimal);
  }
  if (fechaDiagnostico !== undefined) {
    query += 'fechaDiagnostico = ?, ';
    params.push(fechaDiagnostico);
  }
  if (diagnostico !== undefined) {
    query += 'diagnostico = ?, ';
    params.push(diagnostico);
  }
  if (medicamentos !== undefined) {
    query += 'medicamentos = ?, ';
    params.push(medicamentos);
  }
  if (dosis !== undefined) {
    query += 'dosis = ?, ';
    params.push(dosis);
  }
  if (cantidad !== undefined) {
    query += 'cantidad = ?, ';
    params.push(cantidad);
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
