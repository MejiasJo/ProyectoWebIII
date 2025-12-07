// services/animalsService.js
import pool from './db.js';

const estadosValidos = ['sano', 'tratamiento', 'enfermo'];
const sexosValidos = ['m', 'f', 'macho', 'hembra'];

const normalizarSexo = (sexo) => {
    if (!sexo) return null;
    const s = sexo.trim().toLowerCase();
    if (s === 'm' || s === 'macho') return 'M';
    if (s === 'f' || s === 'hembra') return 'F';
    throw new Error('Sexo no válido. Use M, F, macho o hembra.');
};

export const getAll = async () => {
  const [rows] = await pool.execute(`
    SELECT a.idAnimal, a.idCliente, u.name AS nombreCliente, a.nombre, a.sexo, a.especie, a.peso, a.raza, a.estado
    FROM Animal a LEFT JOIN Users u ON a.idCliente = u.id ORDER BY a.idAnimal DESC`);
  return rows;
};

export const getById = async (idAnimal) => {
  const [rows] = await pool.execute(`
    SELECT a.idAnimal, a.idCliente, u.name AS nombreCliente, a.nombre, a.sexo, a.especie, a.peso, a.raza, a.estado
    FROM Animal a LEFT JOIN Users u ON a.idCliente = u.id WHERE a.idAnimal = ? `, [idAnimal]);
  return rows[0];
};

export const getDynamic = async (filters = {}) => {
  const where = [];
  const values = [];

   // Filtrar por especie
  if (filters.especie) {
    where.push("LOWER(a.especie) = ?");
    values.push(filters.especie.trim().toLowerCase());
  }

  // Filtrar por estado (sano, enfermo, tratamiento)
  if (filters.estado) {
    where.push("LOWER(a.estado) = ?");
    values.push(filters.estado.trim().toLowerCase());
  }

  // Filtrar por sexo (M/F)
  if (filters.sexo) {
    where.push("a.sexo = ?");
    values.push(filters.sexo.toUpperCase());
  }

  // Filtrar por cliente
  if (filters.idCliente) {
    where.push("a.idCliente = ?");
    values.push(filters.idCliente);
  }

  const query = `
    SELECT a.idAnimal, a.idCliente, u.name AS nombreCliente,
           a.nombre, a.sexo, a.especie, a.peso, a.raza, a.estado
    FROM Animal a
    LEFT JOIN Users u ON a.idCliente = u.id
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY a.idAnimal DESC
  `;

  const [rows] = await pool.execute(query, values);
  return rows;
};


export const create = async (animal) => {
  const { idCliente, nombre, sexo, especie, peso, raza, estado } = animal;

  if (!idCliente || !nombre || !sexo) {
    throw new Error('Faltan datos obligatorios del animal');
  }

  // Validación sexo
   const sexoNormalizado = normalizarSexo(sexo);
  if (!sexosValidos.includes(sexo.trim().toLowerCase())) {
    throw new Error('Sexo no válido');
  }

  // Validación peso numérico
  if (peso !== undefined && isNaN(Number(peso))) {
    throw new Error('Peso debe ser numérico');
  }

  // Normalización y validación estado
  let estadoNormalizado = null;
  if (estado !== undefined && estado !== null) {
    estadoNormalizado = estado.trim().toLowerCase();
    if (!estadosValidos.includes(estadoNormalizado)) {
      throw new Error('Estado no válido');
    }
  }

  const [result] = await pool.execute(`
    INSERT INTO Animal (idCliente, nombre, sexo, especie, peso, raza, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?) `, [idCliente, nombre, sexoNormalizado,, especie, peso, raza, estadoNormalizado]);
  return getById(result.insertId);
};

export const update = async (idAnimal, animal) => {
  const existe = await getById(idAnimal);
  if (!existe) throw new Error('Animal not found');
  const { idCliente, nombre, sexo, especie, peso, raza, estado } = animal;
  const fields = [];
  const values = [];

  if (idCliente !== undefined) { fields.push('idCliente = ?'); values.push(idCliente); }
  if (nombre !== undefined)   { fields.push('nombre = ?'); values.push(nombre); }

  
  if (sexo !== undefined) {
    const sexoNormalizado = normalizarSexo(sexo);
    fields.push('sexo = ?');
    values.push(sexoNormalizado);
  }

  if (especie !== undefined)  { fields.push('especie = ?'); values.push(especie); }

  if (peso !== undefined) {
    if (isNaN(Number(peso))) throw new Error('Peso debe ser numérico');
    fields.push('peso = ?');
    values.push(peso);
  }

  if (raza !== undefined)     { fields.push('raza = ?'); values.push(raza); }

  if (estado !== undefined) {
    const estadoNormalizado = estado.trim().toLowerCase();
    if (!estadoNormalizado || !estadosValidos.includes(estadoNormalizado)) {
      throw new Error('Estado no válido');
    }
    fields.push('estado = ?');
    values.push(estadoNormalizado);
  }

  if (fields.length === 0) {
    throw new Error('No hay datos para actualizar');
  }

  values.push(idAnimal);

  const [result] = await pool.execute(
    `UPDATE Animal SET ${fields.join(', ')} WHERE idAnimal = ?`,
    values
  );
  if (result.affectedRows === 0) {
    throw new Error('Error al actualizar animal');
  }

  return getById(idAnimal);
};

export const deleteById = async (idAnimal) => {
  const [result] = await pool.execute(
    'DELETE FROM Animal WHERE idAnimal = ?', [idAnimal]);
  if (result.affectedRows === 0) {
    throw new Error('Error al eliminar animal');
  }

  return { message: 'Animal eliminado correctamente' };
};
