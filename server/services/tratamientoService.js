import pool from './db.js';

export const getAll = async (filters) => {
  const where = [];
  const values = [];
  let join = '';

  if (filters && filters.userId) {
    join = ' JOIN Animal a ON t.idAnimal = a.idAnimal ';
    where.push('a.idCliente = ?');
    values.push(filters.userId);
  }
  const sql = `SELECT t.* FROM Tratamiento t ${join}${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY t.idTratamiento DESC`;
  const [rows] = await pool.execute(sql, values);
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.execute('SELECT idTratamiento, idAnimal, idVeterinario, tratamiento, fechaInicio, fechaFin, dosis, instrucciones FROM Tratamiento WHERE idTratamiento = ?', [id]);
  return rows[0];
}

export const create = async (treatment) => {
  const { idAnimal, idVeterinario, tratamiento, fechaInicio, fechaFin, dosis, instrucciones } = treatment;
  if (!idAnimal || !idVeterinario || !tratamiento || !fechaInicio || !fechaFin || !dosis || !instrucciones) {
    throw new Error('Faltan datos del Tratamiento');
  }

  const [result] = await pool.execute(
    'INSERT INTO Tratamiento (idAnimal, idVeterinario, tratamiento, fechaInicio, fechaFin, dosis, instrucciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [idAnimal, idVeterinario, tratamiento, fechaInicio, fechaFin, dosis, instrucciones]
  );
  return getById(result.insertId);
}

export const update = async (id, treatment) => {
  const { idVeterinario, tratamiento, fechaInicio, fechaFin, dosis, instrucciones } = treatment;
  const fields = [];
  const values = [];

  if (idVeterinario !== undefined) { fields.push('idVeterinario = ?'); values.push(idVeterinario); }
  if (tratamiento !== undefined) { fields.push('tratamiento = ?'); values.push(tratamiento); }
  if (fechaInicio !== undefined) { fields.push('fechaInicio = ?'); values.push(fechaInicio); }
  if (fechaFin !== undefined) { fields.push('fechaFin = ?'); values.push(fechaFin); }
  if (dosis !== undefined) { fields.push('dosis = ?'); values.push(dosis); }
  if (instrucciones !== undefined) { fields.push('instrucciones = ?'); values.push(instrucciones); }

  if (fields.length === 0) throw new Error('No hay datos para actualizar');

  values.push(id);
  const [result] = await pool.execute(
    `UPDATE Tratamiento SET ${fields.join(', ')} WHERE idTratamiento = ?`,
    values
  );
  if (result.affectedRows === 0) throw new Error('Treatment not found');

  return getById(id);
};

export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM Tratamiento WHERE idTratamiento = ?', [id]);
  if (result.affectedRows === 0) throw new Error('Treatment not found');
  return { message: 'Treatment deleted successfully' };
};