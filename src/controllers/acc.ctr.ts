import dto from '../dto/index.ts';
import srv from '../services/index.ts';
import { httpStatus, TKN } from '../static/index.ts';
import type { Ctx } from '../static/types.ts';
import type { JWTPayload } from '../utils/types.ts';
import { sch } from '../validation/index.ts';
import { hashPwd, reactivate, setTkn, verifyPwd } from './helpers/helpers.ts';

async function getAccData(ctx: Ctx<false>) {
  const { res, usr } = ctx;

  const dbres = await srv.usr.getById((usr as JWTPayload).id);

  const data = JSON.stringify(dto.usr(dbres));

  res.statusCode = httpStatus.ok;
  res.end(data);
}

async function deleteAcc(ctx: Ctx<false>) {
  const { res, usr } = ctx;

  await srv.usr.delete((usr as JWTPayload).id);

  res.setHeader('Set-Cookie', [
    setTkn(TKN.ACC, '', '0'),
    setTkn(TKN.RFR, '', '0'),
  ]);

  res.statusCode = httpStatus.nc;
  res.end();
}

async function patchAcc(ctx: Ctx<typeof sch.profUpd>) {
  const { res, body, usr } = ctx;
  const { password, email, name } = body;

  const usrFromDB = await verifyPwd((usr as JWTPayload).id, password);

  let payload;

  if (email === usrFromDB.email) {
    payload = { name };

    const newUsr = await srv.usr.patch(usrFromDB.id, payload);

    res.statusCode = httpStatus.ok;
    res.end(JSON.stringify(dto.usr(newUsr)));
  } else {
    payload = { name, email };

    const newUsr = await srv.usr.patch(usrFromDB.id, payload);

    await reactivate(newUsr, res);
  }
}

async function resetPass(ctx: Ctx<typeof sch.pwdPtch>) {
  const { res, body, usr } = ctx;
  const { oldPwd, newPwd } = body;

  const usrFromDB = await verifyPwd((usr as JWTPayload).id, oldPwd);
  const hashedPwd = await hashPwd(newPwd);
  const newUsr = await srv.usr.patch(usrFromDB.id, { password: hashedPwd });

  await reactivate(newUsr, res);
}

const acc = {
  get: getAccData,
  del: deleteAcc,
  patch: patchAcc,
  res: resetPass,
};

export default acc;
