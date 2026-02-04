import DB from '../model';
import { TKN, TNAMES, fnames } from '../static';
import { asyncDBHandler } from '../utils';
import { del, getByParam } from './general.service';
import { DBResTkn } from './types';

const tkNames = fnames[TNAMES.TKN];

async function createToken (
  userId: string,
  token: string,
  type: Exclude<TKN, TKN.ACC>,
  expiresAt: string,
): Promise<DBResTkn> {
  const newToken = await DB[TNAMES.TKN].create({
    [tkNames.usr]: userId,
    [tkNames.token]: token,
    [tkNames.type]: type,
    [tkNames.exp]: expiresAt,
  });

  return newToken.toJSON();
};

async function getByTkn(tkn: string): Promise<DBResTkn> {
  const token = await getByParam(TNAMES.TKN, fnames[TNAMES.TKN].token, tkn);

  return token;
}


const tkn = {
  create: asyncDBHandler((userId, token, type, expiresAt) =>
    createToken(userId, token, type, expiresAt)),
  getByTkn: asyncDBHandler((tkn: string) => getByTkn(tkn)),
  del: asyncDBHandler((id: string) => del(TNAMES.TKN, id)),
};

export default tkn;
