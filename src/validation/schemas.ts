import { endpt, fnames, TNAMES } from '../static';

const usrFNames = fnames[TNAMES.USR];
const tkFNames = fnames[TNAMES.TKN];

const authSch = {
  [usrFNames.email]: 'string',
  [usrFNames.pwd]: 'string',
};

const regSch = {
  [usrFNames.name]: 'string',
  [usrFNames.email]: 'string',
  [usrFNames.pwd]: 'string',
} as const;
const sch = {
  auth: authSch,
  authSN: {},
  refr: {},
  reg: regSch,
  profUpd: {
    [usrFNames.name]: 'string',
    [usrFNames.email]: 'string',
    [usrFNames.pwd]: 'string',
    confirmation: 'string',
  },
  pwdPtch: {
    oldPwd: 'string',
    newPwd: 'string',
    confirmation: 'string',
  },
  pwdReq: {
    [usrFNames.email]: 'string',
  },
  newPwd: {
    [tkFNames.token]: 'string',
    newPassword: 'string',
    confirmation: 'string',
  },
};

export default sch;
