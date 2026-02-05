import http from 'http';
import { jwtAct, parseCookies } from '../utils/index.ts';
import { ckNms } from '../controllers/helpers/helpers.ts';
import { httpStatus, TKN } from '../static/index.ts';
import { RequestError } from '../errors/errors.ts';

function tokenAuth(req: http.IncomingMessage) {
  const cookies = parseCookies(req);
  const token = cookies[ckNms[TKN.ACC]];

  if (!token) {
    throw new RequestError('No token provided', httpStatus.ua);
  }

  const { type, ...pl } = jwtAct.ver(token);

  if (type !== TKN.ACC) {
    throw new RequestError('Invalid token type', httpStatus.ua);
  }

  return pl;
}

export default tokenAuth;
