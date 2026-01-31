import { endpt, fnames, TNAMES } from '../static';

const usrFNames = fnames[TNAMES.USR];
const tkFNames = fnames[TNAMES.TKN];

const sch = {
  auth: {
    [usrFNames.email]: 'string',
    [usrFNames.pwd]: 'string',
  },
  authSN: {},
  reg: {
    [usrFNames.name]: 'string',
    [usrFNames.email]: 'string',
    [usrFNames.pwd]: 'string',
  },
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
} as const;

export default sch;