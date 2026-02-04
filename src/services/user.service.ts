import { fnames, TNAMES } from '../static/index.ts';
import { asyncDBHandler } from '../utils/index.ts';
import { del, get, getByParam } from './general.service.ts';

const a = asyncDBHandler;

const usrServices = {
  getById: a((id: string) => get(TNAMES.USR, id)),
  // eslint-disable-next-line max-len, prettier/prettier
  getByEmail: a((e: string) => getByParam(TNAMES.USR, fnames[TNAMES.USR].email, e)),
  delete: a((id: string) => del(TNAMES.USR, id)),
};

export default usrServices;
