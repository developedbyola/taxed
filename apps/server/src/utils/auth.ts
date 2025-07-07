import { env } from '@/configs/env';
import { type Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { UAParser } from 'ua-parser-js';
import { sha256 } from 'hono/utils/crypto';
import { getConnInfo as BunConnInfo } from 'hono/bun';
import type { JWTPayload } from 'hono/utils/jwt/types';

type TokenOptions = {
  type: 'access' | 'refresh';
  payload: {
    userId: string;
    sessionId: string;
  };
  expiresIn?: number;
};

const SECRETS = {
  access: env.ACCESS_TOKEN_SECRET,
  refresh: env.REFRESH_TOKEN_SECRET,
} as const;

const DEFAULT_EXPIRES = {
  access: 60 * 60,
  refresh: 60 * 60 * 24 * 90,
} as const;

/**
 * Gets the expiry time for a token.
 * @param {number} seconds - The number of seconds until the token expires.
 * @returns The expiry time in seconds.
 */
const getExpiry = (seconds: number) => Math.floor(Date.now() / 1000) + seconds;

/**
 * Signs a token for a user session.
 * @param {TokenOptions} options - The options for creating the token.
 * @param {string} options.type - The type of token to create ('access' or 'refresh').
 * @param {object} options.payload - The payload to include in the token.
 * @param {number} [options.expiresIn] - The number of seconds until the token expires.
 * @returns A promise that resolves to the created token.
 */

export async function signToken({
  type,
  payload,
  expiresIn = DEFAULT_EXPIRES[type],
}: TokenOptions) {
  const exp = getExpiry(expiresIn);
  try {
    const token = await sign({ ...payload, exp }, SECRETS[type]);
    return token;
  } catch (err: any) {
    throw err;
  }
}

/**
 * Verifies a token and returns the payload.
 * @param {string} type - The type of token to decode ('access' or 'refresh').
 * @param {string} token - The token to decode.
 * @return A promise that resolves to the decoded payload.
 */
export async function verifyToken(type: 'access' | 'refresh', token: string) {
  try {
    const decoded = await verify(token, SECRETS[type]);
    return decoded as JWTPayload & TokenOptions['payload'];
  } catch (err: any) {
    console.error(`Token verification error ${token}:`, err);
    throw err;
  }
}

/**
 * Gets the IP address from the request, considering proxy headers.
 * Works in both development (Bun) and production (Render).
 */
const getIpAddress = (ctx: Context) => {
  if (env.NODE_ENV === 'development') {
    const conn = BunConnInfo(ctx);
    return conn?.remote?.address ?? 'unknown';
  }

  // Production (Render) - Use headers due to proxy
  return (
    ctx.req.header('x-forwarded-for')?.split(',')[0]?.trim() || // Most reliable on Render
    ctx.req.header('cf-connecting-ip') || // Cloudflare (if used)
    ctx.req.header('x-real-ip') || // Alternative header
    'unknown'
  );
};

export const auth = {
  getExpiry,
  expires: DEFAULT_EXPIRES,
  jwt: {
    sign: signToken,
    verify: verifyToken,
  },
  session: async (ctx: Context) => {
    const headers = ctx.req.raw.headers;

    const fingerprintPayload = [
      headers.get('user-agent'),
      headers.get('accept-language'),
      headers.get('sec-ch-ua-platform'),
    ].join('|');
    const fingerprint = await sha256(fingerprintPayload);

    const userAgent = headers.get('user-agent') || '';
    const parser = new UAParser(userAgent);

    const ua = parser.getResult();

    const appVersion = headers.get('x-app-version');
    const osVersion = headers.get('x-os-version') || ua.os.version || 'unknown';
    const deviceType =
      headers.get('x-device-type') || ua.device.type || 'unknown';
    const deviceName =
      headers.get('x-device-name') || ua.device.vendor || 'unknown';

    const ipAddress = getIpAddress(ctx);

    return {
      userAgent,
      ipAddress,
      fingerprint,
      appVersion,
      osVersion,
      deviceType,
      deviceName,
      expiresAt: Date.now() + DEFAULT_EXPIRES.refresh * 1000,
    };
  },
};
