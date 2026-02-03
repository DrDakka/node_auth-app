import jwt from 'jsonwebtoken';
import { RequestError } from '../errors';
import { fnames, httpStatus, TKN, TNAMES } from '../static';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const TOKEN_EXPIRY: Record<TKN, string> = {
  [TKN.ACC]: '15m', // access token - 15 минут
  [TKN.RFR]: '7d', // refresh token - 7 дней
  [TKN.ACT]: '24h', // activation token - 24 часа
  [TKN.PWR]: '1h', // password reset token - 1 час
};

const nms = fnames[TNAMES.USR];

type JWTPayload = {
  [nms.id]: string;
  [nms.name]: string;
  [nms.email]: string;
};

function signToken(
  payload: JWTPayload,
  type: TKN,
): { expiry: string; token: string } {
  const expiry = TOKEN_EXPIRY[type];

  const token = jwt.sign(
    {
      ...payload,
      type,
    },
    SECRET_KEY,
    { expiresIn: expiry } as jwt.SignOptions,
  );

  return { expiry, token };
}

/**
 * Проверяет и декодирует JWT токен
 */
function verifyToken(token: string): JWTPayload & { type: TKN } {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JWTPayload & {
      type: TKN;
    };

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new RequestError('Token has expired', httpStatus.na);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new RequestError('Invalid token', httpStatus.br);
    }

    throw new RequestError('Token verification failed', httpStatus.br);
  }
}

async function createAccessToken(
  payload: JWTPayload,
): Promise<{ expiry: string; token: string }> {
  return signToken(payload, TKN.ACC);
}

async function createRefreshToken(
  payload: JWTPayload,
): Promise<{ expiry: string; token: string }> {
  return signToken(payload, TKN.RFR);
}

export { signToken, verifyToken, createAccessToken, createRefreshToken };
export type { JWTPayload };
