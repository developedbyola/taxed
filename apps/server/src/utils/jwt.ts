import { sign, verify } from 'hono/jwt';

type Payload<T extends object> = T;

/**
 * Signs a token for a user session.
 * @param {string} secret - The secret to sign the token with.
 * @param {Payload<T>} payload - The payload to include in the token.
 * @returns A promise that resolves to the created token.
 */
export const signToken = async <T extends object>(
  secret: string,
  exp: number,
  payload: Payload<T>
): Promise<string> => {
  try {
    const token = await sign({ ...payload, exp: exp }, secret);
    return token;
  } catch (err: any) {
    throw err;
  }
};

/**
 * Verifies a token and returns the payload.
 * @param {string} secret - The secret to verify the token with.
 * @param {string} token - The token to verify.
 * @returns A promise that resolves to the decoded payload.
 */
export const verifyToken = async <T extends object>(
  secret: string,
  token: string
): Promise<T> => {
  try {
    const decoded = await verify(token, secret);
    return decoded as Payload<T>;
  } catch (err: any) {
    throw err;
  }
};

const jwt = {
  sign: signToken,
  verify: verifyToken,
};

export default jwt;
