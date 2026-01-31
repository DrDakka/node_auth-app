import { fnames, TNAMES } from '../static';

const usrNames = fnames[TNAMES.USR];
const scnNames = fnames[TNAMES.SCN];
const tknNames = fnames[TNAMES.TKN];

interface NormUser {
  [usrNames.id]: string;
  [usrNames.name]: string;
  [usrNames.email]: string;
  [usrNames.pwd]: string;
}

interface DBUser extends NormUser {
  [usrNames.act]: boolean;
  createdAt: string;
  updatedAt: string;
}
