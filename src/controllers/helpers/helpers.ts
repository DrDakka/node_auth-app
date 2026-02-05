import http from 'http';
import bcrypt from 'bcrypt';
import srv from '../../services/index.ts';
import { httpStatus, TKN } from '../../static/index.ts';
import type { DBUser } from '../../static/types/user.types.ts';
import { RequestError } from '../../errors/errors.ts';
import jwtAct from '../../utils/jwt.ts';

const SALT_ROUNDS = 10;

const ckNms = {
  [TKN.ACC]: 'access_token',
  [TKN.RFR]: 'refresh_token',
};

const setTkn = (t: typeof TKN.ACC | typeof TKN.RFR, s: string, age: string) =>
  `${ckNms[t]}=${s}; HttpOnly; Path=/; Max-Age=${age}; SameSite=Strict`;

const verifyPwd = async (usrId: string, pwd: string): Promise<DBUser> => {
  const usr = await srv.usr.getById(usrId);

  const isValid = await bcrypt.compare(pwd, usr.password);

  if (!isValid) {
    throw new RequestError(`Wrong password`, httpStatus.ua);
  }

  return usr;
};

const hashPwd = async (pwd: string) => {
  return bcrypt.hash(pwd, SALT_ROUNDS);
};

async function reactivate(user: DBUser, res: http.ServerResponse) {
  await srv.tkn.delByUserId(user.id, TKN.RFR);

  await srv.usr.patch(user.id, { activated: false });

  const jwtPayload = { id: user.id, name: user.name, email: user.email };

  const actToken = jwtAct.sign(jwtPayload, TKN.ACT);

  const createPl = {
    userId: user.id,
    token: actToken.token,
    type: TKN.ACT,
    expiresAt: actToken.expiresAt,
  };

  await srv.tkn.create(createPl);

  srv.email
    .sendActivation(jwtPayload.email, actToken.token)
    .catch((err: Error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to send activation email:', err.message);
    });

  res.setHeader('Set-Cookie', [
    setTkn(TKN.ACC, '', '0'),
    setTkn(TKN.RFR, '', '0'),
  ]);

  res.statusCode = httpStatus.ok;

  res.end(
    JSON.stringify({
      message:
        'Email or password changed. Check your inbox for activation link.',
    }),
  );
}

export { ckNms, setTkn, verifyPwd, reactivate, hashPwd };
