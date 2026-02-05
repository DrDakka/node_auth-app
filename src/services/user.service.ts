import DB from '../model/index.ts';
import { fnames, TNAMES } from '../static/index.ts';
import type { PatchUser } from '../static/types/index.ts';
import aDBH from '../utils/dbHandler.ts';
import { base } from './repo.service.ts';
import type { Create } from './types.ts';

async function patchUser(id: string, payload: Partial<PatchUser>) {
  const user = await base.get(TNAMES.USR, id);

  await DB[TNAMES.USR].update(payload, { where: { id } });

  return { ...user, ...payload };
}

const usr = {
  getById: (id: string) => base.get(TNAMES.USR, id),
  getByEmail: (e: string) =>
    base.getByPrm(TNAMES.USR, fnames[TNAMES.USR].email, e),
  delete: (id: string) => base.del(TNAMES.USR, id),
  create: (data: Create[typeof TNAMES.USR]) => base.crt(TNAMES.USR, data),
  existsByEmail: async (email: string): Promise<boolean> => {
    try {
      await base.getByPrm(TNAMES.USR, fnames[TNAMES.USR].email, email);

      return true;
    } catch {
      return false;
    }
  },
  patch: aDBH((id: string, pl: Partial<PatchUser>) => patchUser(id, pl)),
};

export default usr;
