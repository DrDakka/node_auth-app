import DB from '../model/index.ts';
import { TKN, TNAMES, type Tokens, fnames } from '../static/index.ts';
import { asyncDBHandler } from '../utils/index.ts';
import { del, getByParam } from './general.service.ts';
import { type DBResTkn } from './types.ts';

const tkNames = fnames[TNAMES.TKN];

async function createToken(
  userId: string,
  token: string,
  type: Exclude<Tokens, typeof TKN.ACC>,
  expiresAt: string,
): Promise<DBResTkn> {
  const newToken = await DB[TNAMES.TKN].create({
    [tkNames.usr]: userId,
    [tkNames.token]: token,
    [tkNames.type]: type,
    [tkNames.exp]: expiresAt,
  });

  return newToken.toJSON();
}

async function getByTkn(t: string): Promise<DBResTkn> {
  const token = await getByParam(TNAMES.TKN, fnames[TNAMES.TKN].token, t);

  return token;
}

const tkn = {
  create: asyncDBHandler((id, t, tp, exp) => createToken(id, t, tp, exp)),
  getByTkn: asyncDBHandler((t: string) => getByTkn(t)),
  del: asyncDBHandler((id: string) => del(TNAMES.TKN, id)),
};

export default tkn;
