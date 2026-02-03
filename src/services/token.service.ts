import DB from '../model';
import { TKN, TNAMES, fnames } from '../static';
import { asyncDBHandler } from '../utils';
import { ObjectMapType } from './types';

const tkFNames = fnames[TNAMES.TKN];

const createToken = async (
  userId: string,
  token: string,
  type: Exclude<TKN, TKN.ACC>,
  expiresAt: string,
): Promise<ObjectMapType[TNAMES.TKN]> => {
  const newToken = await DB[TNAMES.TKN].create({
    [tkFNames.usr]: userId,
    [tkFNames.token]: token,
    [tkFNames.type]: type,
    [tkFNames.exp]: expiresAt,
  });

  return newToken.toJSON();
};

const tknServices = {
  create: asyncDBHandler(
    (
      userId: string,
      token: string,
      type: Exclude<TKN, TKN.ACC>,
      expiresAt: string,
    ) => createToken(userId, token, type, expiresAt),
  ),
};

export default tknServices;
