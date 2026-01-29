import { NotAllowedError } from '../errors/errors';
import { Endpoint, endpt } from '../static/endpoints';
import { Method, mthd } from '../static/vocab/httpVocab';

type Entr = {
  auth: boolean;
  schema: false | Object;
  controller: () => void;
};

const routeMap = {
  [endpt.idx]: {
    [mthd.get]: { auth: false, schema: false,
      controller: () => true,
    },
  },
  [endpt.auth]: {
    [mthd.post]: { auth: false, schema: schema.auth, controller: () => true },
  },
  [endpt.snauth]: {
    [mthd.post]: { auth: false, schema: schema.authSN, controller: () => true },
  },
  [endpt.lgout]: {
    [mthd.patch]: { auth: true, schema: schema.lgout, controller: () => true },
  },
  [endpt.reg]: {
    [mthd.post]: {
      auth: false,
      schema: schema.reg,
      controller: () => true,
    },
  },
  [endpt.act]: {
    [mthd.get]: {
      auth: false,
      schema: schema.act,
      controller: () => true,
    },
  },
  [endpt.acc]: {
    [mthd.get]: {
      auth: true,
      schema: false, // I can parse userId from JWT
      controller: () => true,
    },
    [mthd.del]: {
      auth: true,
      schema: false,
      controller: () => true,
    },
    [mthd.patch]: {
      auth: true,
      schema: schema.profUpd,
      controller: () => true,
    },
  },
  [endpt.pwd]: {
    [mthd.patch]: {
      auth: true,
      schema: schema.pwdPtch,
      controller: () => true,
    },
  },
  [endpt.pwdReq]: {
    [mthd.post]: {
      auth: false,
      schema: schema.pwdRes,
      controller: () => true,
    },
  },
  [endpt.pwdRes]: {
    [mthd.post]: {
      auth: false,
      schema: schema.newPwd,
      controller: () => true,
    },
  },
} as const;

const getRouteConfig = (ep: Endpoint, mthd: Method): Entr => {
  const epRoutes = routeMap[ep];
  const conf = epRoutes[mthd as keyof typeof epRoutes];

  if (!conf) {
    throw new NotAllowedError()
  };

  return conf;
}

export { routeMap, getRouteConfig };
