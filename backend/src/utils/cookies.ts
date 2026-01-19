import { Response } from 'express';

export const ACCESS_COOKIE_NAME = 'access_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';

export function getCookieOptions(maxAgeMs?: number) {
  const sameSite = (process.env.COOKIE_SAME_SITE || 'lax') as 'lax' | 'strict' | 'none';
  const secure = process.env.COOKIE_SECURE === 'true';
  const httpOnly = process.env.COOKIE_HTTP_ONLY !== 'false';

  return {
    httpOnly,
    secure,
    sameSite,
    path: '/',
    ...(maxAgeMs ? { maxAge: maxAgeMs } : {}),
  };
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string, accessMaxAgeMs: number, refreshMaxAgeMs: number) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, getCookieOptions(accessMaxAgeMs));
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getCookieOptions(refreshMaxAgeMs));
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE_NAME, getCookieOptions());
  res.clearCookie(REFRESH_COOKIE_NAME, getCookieOptions());
}
