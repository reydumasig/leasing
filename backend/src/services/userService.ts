import bcrypt from 'bcrypt';
import pool from '../db/pool';
import { User, UserRole } from '../types';

const SALT_ROUNDS = 10;

export async function createUser(email: string, password: string, role: UserRole): Promise<User> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query<User>(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING id, email, password_hash, role, created_at, updated_at`,
    [email.toLowerCase(), passwordHash, role]
  );

  return result.rows[0];
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    'SELECT id, email, password_hash, role, created_at, updated_at FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  return result.rows[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await pool.query<User>(
    'SELECT id, email, password_hash, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
}

export async function listUsers(): Promise<User[]> {
  const result = await pool.query<User>(
    'SELECT id, email, password_hash, role, created_at, updated_at FROM users ORDER BY created_at DESC'
  );

  return result.rows;
}

export async function updateUser(id: string, updates: { email?: string; password?: string; role?: UserRole }): Promise<User | null> {
  const fields: string[] = [];
  const values: Array<string | UserRole> = [];

  if (updates.email) {
    values.push(updates.email.toLowerCase());
    fields.push(`email = $${values.length}`);
  }

  if (updates.password) {
    const passwordHash = await bcrypt.hash(updates.password, SALT_ROUNDS);
    values.push(passwordHash);
    fields.push(`password_hash = $${values.length}`);
  }

  if (updates.role) {
    values.push(updates.role);
    fields.push(`role = $${values.length}`);
  }

  if (fields.length === 0) {
    return getUserById(id);
  }

  values.push(id);
  const result = await pool.query<User>(
    `UPDATE users SET ${fields.join(', ')}, updated_at = now() WHERE id = $${values.length}
     RETURNING id, email, password_hash, role, created_at, updated_at`,
    values
  );

  return result.rows[0] || null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return result.rowCount > 0;
}
