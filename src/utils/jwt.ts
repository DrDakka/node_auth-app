import jwt from 'jsonwebtoken';
import { RequestError } from '../errors';
import { fnames, httpStatus, TKN, TNAMES } from '../static';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

const TOKEN_EXPIRY: Record<TKN, string> = {
  [TKN.ACC]: '15m',        // access token - 15 минут
  [TKN.RFR]: '7d',          // refresh token - 7 дней
  [TKN.ACT]: '24h',         // activation token - 24 часа
  [TKN.PWR]: '1h',          // password reset token - 1 час
};

const nms = fnames[TNAMES.USR];

type JWTPayload = {
  [nms.id]: string;
  [nms.name]: string;
  [nms.email]: string;
};

function signToken(payload: JWTPayload, type: TKN): string {
  const expiry = TOKEN_EXPIRY[type];

  return jwt.sign(
    {
      ...payload,
      type,
    },
    SECRET_KEY,
    { expiresIn: expiry } as jwt.SignOptions,
  );
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
      throw new RequestError('Token expired', httpStatus.br);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new RequestError('Invalid token', httpStatus.br);
    }

    throw new RequestError('Token verification failed', httpStatus.br);
  }
}

/**
 * Создает access токен для пользователя
 * TODO: Заглушка - будет получать данные из БД
 */
async function createAccessToken(userId: string): Promise<string> {
  // TODO: Получить данные пользователя из БД
  const user = {
    [nms.id]: userId,
    [nms.name]: 'Mock User',
    [nms.email]: 'mock@example.com',
  };

  return signToken(user, TKN.ACC);
}

async function createRefreshToken(userId: string): Promise<string> {
  // TODO: Получить данные пользователя из БД
  const user = {
    userId,
    name: 'Mock User',
    email: 'mock@example.com',
  };

  const token = signToken(user, TKN.RFR);

  // TODO: Сохранить refresh токен в БД (модель Token)
  // await Token.create({
  //   userId,
  //   token,
  //   type: 'refresh',
  //   expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  // });

  return token;
}

export { signToken, verifyToken, createAccessToken, createRefreshToken };
export type { JWTPayload };
