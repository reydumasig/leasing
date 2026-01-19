import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { JWTPayload } from '../types';
import { parseDurationToMs } from '../utils/time';

const DEFAULT_ACCESS_MS = 15 * 60 * 1000;
const DEFAULT_REFRESH_MS = 7 * 24 * 60 * 60 * 1000;

function getAccessSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

function getRefreshSecret(): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not set');
  }
  return secret;
}

export function getAccessTokenTtlMs(): number {
  return parseDurationToMs(process.env.JWT_EXPIRES_IN || '', DEFAULT_ACCESS_MS);
}

export function getRefreshTokenTtlMs(): number {
  return parseDurationToMs(process.env.JWT_REFRESH_EXPIRES_IN || '', DEFAULT_REFRESH_MS);
}

export function createAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
}

export function createRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
}

export function verifyAccessToken(token: string): JWTPayload {
  return jwt.verify(token, getAccessSecret()) as JWTPayload;
}

export function verifyRefreshToken(token: string): JWTPayload {
  return jwt.verify(token, getRefreshSecret()) as JWTPayload;
}

export async function saveRefreshToken(userId: string, token: string, expiresAt: Date): Promise<void> {
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, token, expiresAt]
  );
}

export async function deleteRefreshToken(token: string): Promise<void> {
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
}

export async function isRefreshTokenValid(token: string): Promise<boolean> {
  const result = await pool.query(
    'SELECT id FROM refresh_tokens WHERE token = $1 AND expires_at > now()',
    [token]
  );
  return result.rowCount > 0;
}
