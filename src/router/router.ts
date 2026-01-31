import { RequestError } from '../errors';
import { Endpoint, endpt } from '../static/endpoints';
import { httpStatus, Method, mthd } from '../static/vocab/httpVocab';
import sch from '../validation/schemas';

type Entr = {
  auth: boolean;
  schema: false | typeof sch[];
  controller: () => void;
};

const routeMap = {
  [endpt.idx]: {
    [mthd.get]: { auth: false, schema: false, controller: () => true },
  },
  [endpt.auth]: {
    [mthd.post]: { auth: false, schema: sch.auth, controller: () => true },
  },
  [endpt.snauth]: {
    [mthd.post]: { auth: false, schema: sch.authSN, controller: () => true },
  },
  [endpt.lgout]: {
    [mthd.patch]: { auth: true, schema: false, controller: () => true },
  },
  [endpt.reg]: {
    [mthd.post]: { auth: false, schema: sch.reg, controller: () => true },
  },
  [endpt.act]: {
    [mthd.get]: { auth: false, schema: false, controller: () => true },
  },
  [endpt.acc]: {
    [mthd.get]: { auth: true, schema: false, controller: () => true },
    [mthd.del]: { auth: true, schema: false, controller: () => true },
    [mthd.patch]: { auth: true, schema: sch.profUpd, controller: () => true },
  },
  [endpt.pwd]: {
    [mthd.patch]: { auth: true, schema: sch.pwdPtch, controller: () => true },
  },
  [endpt.pwdReq]: {
    [mthd.post]: { auth: false, schema: sch.pwdReq, controller: () => true },
  },
  [endpt.pwdRes]: {
    [mthd.post]: { auth: false, schema: sch.newPwd, controller: () => true },
  },
} as const;

const getRouteConfig = (ep: Endpoint, mthd: Method): Entr => {
  const epRoutes = routeMap[ep];
  const conf = epRoutes[mthd as keyof typeof epRoutes];

  if (!conf) {
    throw new RequestError(
      `Method ${mthd} is not supported for ${ep} endpoint`,
      httpStatus.na,
    );
  }

  return conf;
};

export default getRouteConfig;
