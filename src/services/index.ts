import { DBError } from '../errors';
import { fnames, TNAMES } from '../static';
import { del, get, getByParam } from './general.service';

function asyncDBHandler<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw new DBError(`Database operation failed: ${error}`);
    }
  };
}

const services = {
  [TNAMES.USR]: {
    getById: asyncDBHandler((id: string) => get(TNAMES.USR, id)),
    getByEmail: asyncDBHandler((email: string) => getByParam(TNAMES.USR, fnames[TNAMES.USR].email, email)),
    delete: asyncDBHandler((id: string) => del(TNAMES.USR, id)),
    create: asyncDBHandler
  },
  [TNAMES.SCN]: {
    delete: asyncDBHandler((id: string) => del(TNAMES.SCN, id)),
  },
  [TNAMES.TKN]: {
    delete: asyncDBHandler((id: string) => del(TNAMES.TKN, id)),
  },
};

export default services;