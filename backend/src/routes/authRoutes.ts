import { Router } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { getUserByEmail, getUserById } from '../services/userService';
import {
  createAccessToken,
  createRefreshToken,
  deleteRefreshToken,
  getAccessTokenTtlMs,
  getRefreshTokenTtlMs,
  isRefreshTokenValid,
  saveRefreshToken,
  verifyRefreshToken,
} from '../services/authService';
import { REFRESH_COOKIE_NAME, clearAuthCookies, setAuthCookies } from '../utils/cookies';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/login', async (req, res) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid request', details: parseResult.error.flatten() });
  }

  const { email, password } = parseResult.data;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  const accessTtlMs = getAccessTokenTtlMs();
  const refreshTtlMs = getRefreshTokenTtlMs();
  const refreshExpiresAt = new Date(Date.now() + refreshTtlMs);

  await saveRefreshToken(user.id, refreshToken, refreshExpiresAt);
  setAuthCookies(res, accessToken, refreshToken, accessTtlMs, refreshTtlMs);

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  });
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  const isValid = await isRefreshTokenValid(refreshToken);
  if (!isValid) {
    return res.status(401).json({ error: 'Refresh token expired or revoked' });
  }

  await deleteRefreshToken(refreshToken);

  const accessToken = createAccessToken(payload);
  const newRefreshToken = createRefreshToken(payload);

  const accessTtlMs = getAccessTokenTtlMs();
  const refreshTtlMs = getRefreshTokenTtlMs();
  const refreshExpiresAt = new Date(Date.now() + refreshTtlMs);

  await saveRefreshToken(payload.userId, newRefreshToken, refreshExpiresAt);
  setAuthCookies(res, accessToken, newRefreshToken, accessTtlMs, refreshTtlMs);

  const user = await getUserById(payload.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  });
});

router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }

  clearAuthCookies(res);
  return res.json({ success: true });
});

export default router;
