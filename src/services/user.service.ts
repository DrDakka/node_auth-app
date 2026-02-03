import { fnames, TNAMES } from '../static';
import { asyncDBHandler } from '../utils';
import { del, get, getByParam } from './general.service';

const usrServices = {
  getById: asyncDBHandler((id: string) => get(TNAMES.USR, id)),
  getByEmail: asyncDBHandler((email: string) =>
    getByParam(TNAMES.USR, fnames[TNAMES.USR].email, email),
  ),
  delete: asyncDBHandler((id: string) => del(TNAMES.USR, id)),
};

export default usrServices;
