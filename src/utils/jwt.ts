import jwt from 'jsonwebtoken';
import { RequestError } from '../errors';
import { httpStatus, TKN, TOKEN_EXPIRY } from '../static';
import { JWTPayload } from './types';

const SECRET_KEY = process.env.JWT_SECRET || '7>?~!id(#;fd13/^^$fdkq124<';

type Signed = { expiry: string; token: string };

function signToken(payload: JWTPayload, type: TKN): Signed {
  const expiry = TOKEN_EXPIRY[type][0];

  const token = jwt.sign({ ...payload, type }, SECRET_KEY, {
    expiresIn: expiry,
  } as jwt.SignOptions);

  return { expiry, token };
}

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
const jwtAct = {
  sign: (pl: JWTPayload, tp: TKN) => signToken(pl, tp),
  ver: (tk: string) => verifyToken(tk),
  create: {
    [TKN.ACC]: (payload: JWTPayload): Signed => signToken(payload, TKN.ACC),
    [TKN.RFR]: (payload: JWTPayload): Signed => signToken(payload, TKN.RFR),
  },
};

export default jwtAct;
export type { JWTPayload };
