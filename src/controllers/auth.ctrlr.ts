import http from 'http';
import bcrypt from 'bcrypt';
import { RequestError } from '../errors/index.ts';
import { tkn, usrServices } from '../services/index.ts';
import { httpStatus, TKN, TOKEN_EXPIRY } from '../static/index.ts';
import sch from '../validation/schemas.ts';
import { parseCookies, jwtAct } from '../utils/index.ts';
import { type Ctx } from '../static/types.ts';

const ckNms = {
  [TKN.ACC]: 'access_token',
  [TKN.RFR]: 'refresh_token',
};

const cks = (t: typeof TKN.ACC | typeof TKN.RFR, s: string, age: string) =>
  `${ckNms[t]}=${s}; HttpOnly; Path=/; Max-Age=${age}; SameSite=Strict`;

async function authMan(ctx: Ctx<typeof sch.auth>): Promise<void> {
  const { res, body } = ctx;
  const { email, password } = body;
  // check usr
  const usr = await usrServices.getByEmail(email);

  if (!usr) {
    throw new RequestError(`User with email ${email} not found`, httpStatus.nf);
  }

  // compare pw

  const isValid = await bcrypt.compare(password, usr.password);

  if (!isValid) {
    throw new RequestError(`Wrong password`, httpStatus.na);
  }

  // create tkns

  const { id, name } = usr;
  const payload = { id, name, email };
  const accTkn = jwtAct.create[TKN.ACC](payload);
  const refTkn = jwtAct.create[TKN.RFR](payload);

  // add refresh tkn to DB

  tkn.create(id, refTkn.token, TKN.RFR, refTkn.expiry);

  // set cookies
  res.setHeader('Set-Cookie', [
    cks(TKN.ACC, accTkn.token, TOKEN_EXPIRY.access[1]),
    cks(TKN.RFR, refTkn.token, TOKEN_EXPIRY.refresh[1]),
  ]);

  res.statusCode = httpStatus.ok;
  res.end(JSON.stringify({ message: 'Authorized', user: { id, name, email } }));
}

function authTkn(req: http.IncomingMessage) {
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

async function refresh(ctx: Ctx<false>) {
  const { req, res } = ctx;
  const cookies = parseCookies(req);
  const token = cookies[ckNms[TKN.RFR]];

  if (!token) {
    throw new RequestError('No token provided', httpStatus.ua);
  }

  const { type, ...pl } = jwtAct.ver(token);

  if (type !== TKN.RFR) {
    throw new RequestError('Invalid token type', httpStatus.ua);
  }

  const dbTok = await tkn.getByTkn(token);

  if (!dbTok) {
    throw new RequestError(`Token ${token} doesn't exist`, httpStatus.ua);
  }

  // delete token
  tkn.del(dbTok.id);

  // create new Tokens

  const accTkn = jwtAct.create[TKN.ACC](pl);
  const refTkn = jwtAct.create[TKN.RFR](pl);

  // add refr token to DB

  tkn.create(pl.id, refTkn.token, TKN.RFR, refTkn.expiry);

  // set cookies
  res.setHeader('Set-Cookie', [
    cks(TKN.ACC, accTkn.token, TOKEN_EXPIRY.access[1]),
    cks(TKN.RFR, refTkn.token, TOKEN_EXPIRY.refresh[1]),
  ]);

  // end res
  res.statusCode = httpStatus.ok;
  res.end(JSON.stringify({ message: 'Authorized', user: { ...pl } }));
}

async function logout(ctx: Ctx<false>) {
  const { req, res } = ctx;
  const cookies = parseCookies(req);

  const refToken = cookies[ckNms[TKN.RFR]];

  if (refToken) {
    const dbTok = await tkn.getByTkn(refToken);

    if (dbTok) {
      tkn.del(dbTok.id);
    }
  }
  res.setHeader('Set-Cookie', [cks(TKN.ACC, '', '0'), cks(TKN.RFR, '', '0')]);

  res.statusCode = httpStatus.ok;
  res.end(JSON.stringify({ message: 'Logged out' }));
}

export { authMan, authTkn, refresh, logout };
