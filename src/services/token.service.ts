import DB from '../model/index.ts';
import { TNAMES, type Tokens, fnames } from '../static/index.ts';
import { base } from './repo.service.ts';
import type { Create } from './types.ts';

const nms = fnames[TNAMES.TKN];

const tkn = {
  create: (d: Create[typeof TNAMES.TKN]) => base.crt(TNAMES.TKN, d),
  getByTkn: (q: string) =>
    base.getByPrm(TNAMES.TKN, fnames[TNAMES.TKN].token, q),
  del: (id: string) => base.del(TNAMES.TKN, id),
  delByUserId: (userId: string, type?: Tokens) =>
    DB[TNAMES.TKN].destroy({
      where: type
        ? { [nms.usr]: userId, [nms.type]: type }
        : { [nms.usr]: userId },
    }),
};

export default tkn;
