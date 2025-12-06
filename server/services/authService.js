import jwt from 'jsonwebtoken';
import { validateCredentials } from './usersService.js';

export const login = async (username, password) => {
  const user = await validateCredentials(username, password);
  if (!user) throw new Error('Credenciales inválidas');

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: Number(process.env.JWT_EXPIRES) }
  );

  return { token, user };
};