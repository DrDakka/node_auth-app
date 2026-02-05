import { RequestError } from '../errors/index.ts';
import srv from '../services/index.ts';
import { httpStatus, TKN } from '../static/index.ts';
import { type Ctx } from '../static/types.ts';
import jwtAct from '../utils/jwt.ts';
import { sch } from '../validation/index.ts';
import { hashPwd } from './helpers/helpers.ts';

async function requestReset(ctx: Ctx<typeof sch.pwdReq>) {
  const { res, body } = ctx;

  const user = await srv.usr.getByEmail(body.email);

  await srv.tkn.delByUserId(user.id, TKN.PWR);

  const jwtPayload = { id: user.id, name: user.name, email: user.email };
  const token = jwtAct.sign(jwtPayload, TKN.PWR);

  const createPl = {
    userId: user.id,
    token: token.token,
    type: TKN.PWR,
    expiresAt: token.expiresAt,
  };

  await srv.tkn.create(createPl);

  srv.email.sendReset(user.email, token.token).catch((err: Error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to send reset email:', err.message);
  });

  res.statusCode = httpStatus.ok;

  res.end(
    JSON.stringify({
      message: 'Check your inbox for password reset link.',
    }),
  );
}

async function processReset(ctx: Ctx<typeof sch.newPwd>) {
  const { res, body } = ctx;
  const { token, newPwd } = body;

  const { type, ...payload } = jwtAct.ver(token);

  if (type !== TKN.PWR) {
    throw new RequestError('Invalid token type', httpStatus.br);
  }

  const dbToken = await srv.tkn.getByTkn(token);

  if (dbToken.userId !== payload.id) {
    throw new RequestError('Token mismatch', httpStatus.br);
  }

  const hashedPwd = await hashPwd(newPwd);

  await srv.usr.patch(payload.id, { password: hashedPwd });

  await srv.tkn.del(dbToken.id);

  res.statusCode = httpStatus.ok;

  res.end(
    JSON.stringify({
      message: 'Password reset successfully. You can now login.',
    }),
  );
}

const rst = {
  req: requestReset,
  prc: processReset,
};

export default rst;
