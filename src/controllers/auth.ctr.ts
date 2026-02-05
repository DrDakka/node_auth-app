import bcrypt from 'bcrypt';
import { RequestError } from '../errors/index.ts';
import srv from '../services/index.ts';
import { httpStatus, TKN, TOKEN_EXPIRY } from '../static/index.ts';
import sch from '../validation/schemas.ts';
import { parseCookies, jwtAct } from '../utils/index.ts';
import { type Ctx } from '../static/types.ts';
import { ckNms, setTkn } from './helpers/helpers.ts';

async function manual(ctx: Ctx<typeof sch.auth>): Promise<void> {
  const { res, body } = ctx;
  const { email, password } = body;
  // check usr activation
  const user = await srv.usr.getByEmail(email);

  if (!user.activated) {
    throw new RequestError(
      `User with email ${email} is not activated`,
      httpStatus.ua,
    );
  }

  // compare pw

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new RequestError(`Wrong password`, httpStatus.ua);
  }

  // create tkns

  const { id, name } = user;
  const payload = { id, name, email };
  const accTkn = jwtAct.create[TKN.ACC](payload);
  const refTkn = jwtAct.create[TKN.RFR](payload);

  // add refresh tkn to DB
  const createPayload = {
    userId: id,
    token: refTkn.token,
    type: TKN.RFR,
    expiresAt: refTkn.expiresAt,
  };

  await srv.tkn.create(createPayload);

  // set cookies
  res.setHeader('Set-Cookie', [
    setTkn(TKN.ACC, accTkn.token, TOKEN_EXPIRY.access[1]),
    setTkn(TKN.RFR, refTkn.token, TOKEN_EXPIRY.refresh[1]),
  ]);

  res.statusCode = httpStatus.ok;
  res.end(JSON.stringify({ message: 'Authorized', user: { id, name, email } }));
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

  const dbTok = await srv.tkn.getByTkn(token);

  if (!dbTok) {
    throw new RequestError(`Token ${token} doesn't exist`, httpStatus.ua);
  }

  // delete token
  srv.tkn.del(dbTok.id);

  // create new Tokens

  const accTkn = jwtAct.create[TKN.ACC](pl);
  const refTkn = jwtAct.create[TKN.RFR](pl);

  // add refr token to DB
  const createPayload = {
    userId: pl.id,
    token: refTkn.token,
    type: TKN.RFR,
    expiresAt: refTkn.expiresAt,
  };

  await srv.tkn.create(createPayload);

  // set cookies
  res.setHeader('Set-Cookie', [
    setTkn(TKN.ACC, accTkn.token, TOKEN_EXPIRY.access[1]),
    setTkn(TKN.RFR, refTkn.token, TOKEN_EXPIRY.refresh[1]),
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
    const dbTok = await srv.tkn.getByTkn(refToken);

    if (dbTok) {
      srv.tkn.del(dbTok.id);
    }
  }

  res.setHeader('Set-Cookie', [
    setTkn(TKN.ACC, '', '0'),
    setTkn(TKN.RFR, '', '0'),
  ]);

  res.statusCode = httpStatus.ok;
  res.end(JSON.stringify({ message: 'Logged out' }));
}

const auth = {
  man: manual,
  rfr: refresh,
  lgt: logout,
};

export default auth;
