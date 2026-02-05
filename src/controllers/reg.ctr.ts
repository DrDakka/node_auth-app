import { RequestError } from '../errors/index.ts';
import srv from '../services/index.ts';
import { httpStatus, TKN } from '../static/index.ts';
import { type Ctx } from '../static/types.ts';
import { jwtAct } from '../utils/index.ts';
import sch from '../validation/schemas.ts';
import { hashPwd } from './helpers/helpers.ts';

async function register(ctx: Ctx<typeof sch.reg>): Promise<void> {
  const { res, body } = ctx;
  const { name, email, password } = body;

  // check if user exists

  const exists = await srv.usr.existsByEmail(email);

  if (exists) {
    throw new RequestError(
      `User with email ${email} already exists`,
      httpStatus.br,
    );
  }

  // create user
  const hashedPwd = await hashPwd(password);

  const newUsr = await srv.usr.create({
    name,
    email,
    password: hashedPwd,
  });

  // create activationToken;
  const payload = { id: newUsr.id, name, email };
  const actToken = jwtAct.sign(payload, TKN.ACT);

  const createPL = {
    userId: newUsr.id,
    token: actToken.token,
    type: TKN.ACT,
    expiresAt: actToken.expiresAt,
  };

  await srv.tkn.create(createPL);

  // send activation email (non-blocking, log errors)
  srv.email.sendActivation(email, actToken.token).catch((err: Error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to send activation email:', err.message);
  });

  res.statusCode = httpStatus.cr;

  res.end(
    JSON.stringify({
      message: 'User created. Check your email for activation link.',
      user: { id: newUsr.id, name, email },
    }),
  );
}

async function activate(ctx: Ctx<false>) {
  const { res, param } = ctx;

  const token = await srv.tkn.getByTkn(param as string);

  await srv.usr.patch(token.userId, { activated: true });

  await srv.tkn.del(token.id);

  res.statusCode = httpStatus.ok;
  res.end(JSON.stringify({ message: `Succesfully activated` }));
}

const reg = {
  reg: register,
  act: activate,
};

export default reg;
