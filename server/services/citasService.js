// services/citaService.js
import pool from './db.js';

//Crea una cita nueva 
export const create = async ({ idAnimal, idVeterinario, fechaCita, motivo }) => {
  if (!idAnimal || !idVeterinario || !fechaCita || !motivo) {
    throw new Error('Faltan campos requeridos');
  }

  const [result] = await pool.execute(
    'INSERT INTO Cita (idAnimal, idVeterinario, fechaCita, motivo) VALUES (?, ?, ?, ?)',
    [idAnimal, idVeterinario, fechaCita, motivo]
  );

  // Obtener la cita recién creada para devolverla con todos los datos
  const [newCita] = await pool.execute('SELECT * FROM Cita WHERE idCita = ?', [result.insertId]);
  return newCita[0];
};

// Obtener una cita por su ID
export const getById = async (id) => {
    const [rows] = await pool.execute('SELECT idAnimal, idVeterinario, fechaCita, motivo FROM Users WHERE id = ?', [id]);
  return rows[0];
}

// Da todas las citas (por animal, veterinario y fechaCita)
export const getAll = async (filters = {}) => {
  const { idAnimal, idVeterinario, fechaCita } = filters;
  let query = 'SELECT * FROM Cita';
  const params = [];
  const where = [];

  if (idAnimal !== undefined) {
    where.push('idAnimal = ?');
    params.push(idAnimal);
  }

  if (idVeterinario !== undefined) {
    where.push('idVeterinario = ?');
    params.push(idVeterinario);
  }

  if (fechaCita !== undefined) {
    where.push('fechaCita = ?');
    params.push(fechaCita);
  }

  if (where.length > 0) {
    query += ' WHERE ' + where.join(' AND ');
  }

  query += ' ORDER BY idCita DESC';

  const [rows] = await pool.execute(query, params);
  return rows;
};

// Actualiza una cita
export const update = async (idCita, updates) => {
  const { idAnimal, idVeterinario, fechaCita, motivo } = updates;
  let query = 'UPDATE Cita SET ';
  const params = [];

  if (idAnimal !== undefined) {
    query += 'idAnimal = ?, ';
    params.push(idAnimal);
  }
  if (idVeterinario !== undefined) {
    query += 'idVeterinario = ?, ';
    params.push(idVeterinario);
  }
  if (fechaCita !== undefined) {
    query += 'fechaCita = ?, ';
    params.push(fechaCita);
  }
  if (motivo !== undefined) {
    query += 'motivo = ?, ';
    params.push(motivo);
  }

  query = query.slice(0, -2); // Elimina la última coma
  query += ' WHERE idCita = ?';
  params.push(idCita);

  const [result] = await pool.execute(query, params);
  if (result.affectedRows === 0) {
    throw new Error('Cita no encontrada');
  }

  const [updated] = await pool.execute('SELECT * FROM Cita WHERE idCita = ?', [idCita]);
  return updated[0];
};

// Eliminar una cita
export const deleteById = async (idCita) => {
  const [result] = await pool.execute('DELETE FROM Cita WHERE idCita = ?', [idCita]);
  if (result.affectedRows === 0) {
    throw new Error('Cita no encontrada');
  }
  return { message: 'Cita eliminada correctamente' };
};
