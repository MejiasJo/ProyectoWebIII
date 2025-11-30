import pool from './db.js';
import bcrypt from 'bcrypt';

export const getAll = async () => {
    const [rows] = await pool.execute('SELECT id, name, email, username, role, telefono, direccion FROM Users ORDER BY id DESC');
  return rows;
};

export const getById = async (id) => {
    const [rows] = await pool.execute('SELECT id, name, email, username, role, telefono, direccion FROM Users WHERE id = ?', [id]);
  return rows[0];
}

export const create = async (user) => {
    const {name, email, username, password, role, telefono, direccion} = user;
    if (!name || !email || !username || !password || !role || !telefono || !direccion){
        throw new Error('Faltan datos del usuario');
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
    'INSERT INTO Users (name, email, username, password, role, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, username, hashedPass, role, telefono, direccion]
  );
  return getById(result.insertId);
}

export const update = async (id, user) => {
  const { name, email, username, password, telefono, direccion } = user;
  const fields = [];
  const values = [];

  if (name !== undefined) { fields.push('name = ?'); values.push(name); }
  if (email !== undefined) { fields.push('email = ?'); values.push(email); }
  if (username !== undefined) { fields.push('username = ?'); values.push(username); }
  if (password !== undefined) { fields.push('password = ?'); const hashedPass = await bcrypt.hash(password, 10); values.push(hashedPass); }
  if (telefono !== undefined) { fields.push('telefono = ?'); values.push(telefono); }
  if (direccion !== undefined) { fields.push('direccion = ?'); values.push(direccion); }

  if (fields.length === 0) throw new Error('No hay datos para actualizar');

  values.push(id);
  const [result] = await pool.execute(
    `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  if (result.affectedRows === 0) throw new Error('User not found');

  return getById(id);
};

export const validateCredentials = async (username, password) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length === 0) return null;
  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  delete user.password;
  console.log(user)
  return user;
};

export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('User not found');
  return { message: 'User deleted successfully' };
};