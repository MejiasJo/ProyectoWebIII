// services/animalsService.js
import pool from './db.js';

export const getAll = async () => {
  const [rows] = await pool.execute(` SELECT a.idAnimal, a.idCliente, u.name AS nombreCliente, a.nombre, a.sexo, a.especie, a.peso, a.raza, a.estado
    FROM Animal a LEFT JOIN Users u ON a.idCliente = u.id ORDER BY a.idAnimal DESC `);
  return rows;
};

export const getById = async (idAnimal) => {
  const [rows] = await pool.execute(`SELECT a.idAnimal, a.idCliente, u.name AS nombreCliente, a.nombre, a.sexo, a.especie, a.peso, a.raza, a.estado
    FROM Animal a LEFT JOIN Users u ON a.idCliente = u.id WHERE a.idAnimal = ?`, [idAnimal]);
  return rows[0];
};

export const create = async (animal) => {
  const { idCliente, nombre, sexo, especie, peso, raza, estado } = animal;

  if (!idCliente || !nombre || !sexo) {
    throw new Error('Faltan datos obligatorios del animal');
  }

  const [result] = await pool.execute(`INSERT INTO Animal (idCliente, nombre, sexo, especie, peso, raza, estado) VALUES (?, ?, ?, ?, ?, ?, ?)`,
     [idCliente, nombre, sexo, especie, peso, raza, estado]);
  return getById(result.insertId);
};

export const update = async (idAnimal, animal) => {
  const { idCliente, nombre, sexo, especie, peso, raza, estado } = animal;
  const fields = [];
  const values = [];

  if (idCliente !== undefined) { fields.push('idCliente = ?'); values.push(idCliente); }
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (sexo !== undefined)   { fields.push('sexo = ?'); values.push(sexo); }
  if (especie !== undefined) { fields.push('especie = ?'); values.push(especie); }
  if (peso !== undefined) { fields.push('peso = ?'); values.push(peso); }
  if (raza !== undefined) { fields.push('raza = ?'); values.push(raza); }
  if (estado !== undefined) { fields.push('estado = ?'); values.push(estado); }

  if (fields.length === 0) {
    throw new Error('No hay datos para actualizar');
  }

  values.push(idAnimal);

  const [result] = await pool.execute( `UPDATE Animal SET ${fields.join(', ')} WHERE idAnimal = ?`,values);

  if (result.affectedRows === 0) {
    throw new Error('Animal not found');
  }

  return getById(idAnimal);
};

export const deleteById = async (idAnimal) => {
  const [result] = await pool.execute('DELETE FROM Animal WHERE idAnimal = ?', [idAnimal] );

  if (result.affectedRows === 0) {
    throw new Error('Animal not found');
  }

  return { message: 'Animal eliminado correctamente' };
};
