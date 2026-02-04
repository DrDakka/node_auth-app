import { z } from 'zod';
import { fnames, TNAMES } from '../static';

const usrFNames = fnames[TNAMES.USR];
const tkFNames = fnames[TNAMES.TKN];

const authSch = z.object({
  [usrFNames.email]: z
    .string()
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email',
    }),
  [usrFNames.pwd]: z.string().min(6),
});

const regUpdSch = z.object({
  [usrFNames.name]: z.string().min(3),
  [usrFNames.email]: z
    .string()
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email',
    }),
  [usrFNames.pwd]: z.string().min(6),
});

const pwdUpd = z
  .object({
    oldPwd: z.string(),
    newPwd: z.string().min(6),
    confirmation: z.string().min(6),
  })
  .refine((data) => data.confirmation === data.newPwd, {
    message: "Passwords don't match",
    path: ['confirmation'],
  });

const pwdReq = z.object({
  [usrFNames.email]: z
    .string()
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email',
    }),
});

const pwdRes = z
  .object({
    [tkFNames.token]: z.string(),
    newPwd: z.string().min(6),
    confirmation: z.string(),
  })
  .refine((data) => data.confirmation === data.newPwd, {
    message: "Passwords don't match",
    path: ['confirmation'],
  });

const sch = {
  auth: authSch,
  reg: regUpdSch,
  profUpd: regUpdSch,
  pwdPtch: pwdUpd,
  pwdReq: pwdReq,
  newPwd: pwdRes,
};

export default sch;
