import ctr from '../controllers/index.ts';
import { RequestError } from '../errors/index.ts';
import { type Endpoint, endpt } from '../static/endpoints.ts';
import { httpStatus, type Method, mthd } from '../static/vocab/httpVocab.ts';
import { sch } from '../validation/index.ts';
import { type Ctx } from '../static/types.ts';

type Entr<S extends (typeof sch)[keyof typeof sch] | false> = {
  auth: boolean;
  schema: S;
  ctr: (args: Ctx<S>) => void | Promise<void>;
};

const routeMap = {
  [endpt.idx]: {
    [mthd.get]: { auth: false, schema: false, ctr: ctr.idx },
  },
  [endpt.auth]: {
    [mthd.post]: { auth: false, schema: sch.auth, ctr: ctr.auth.man },
  },
  [endpt.refr]: {
    [mthd.post]: { auth: false, schema: false, ctr: ctr.auth.rfr },
  },
  [endpt.snauth]: {
    [mthd.post]: { auth: false, schema: false, ctr: () => true },
  },
  [endpt.lgout]: {
    [mthd.patch]: { auth: true, schema: false, ctr: ctr.auth.lgt },
  },
  [endpt.reg]: {
    [mthd.post]: { auth: false, schema: sch.reg, ctr: ctr.reg.reg },
  },
  [endpt.act]: {
    [mthd.get]: { auth: false, schema: false, ctr: ctr.reg.act },
  },
  [endpt.acc]: {
    [mthd.get]: { auth: true, schema: false, ctr: ctr.acc.get },
    [mthd.del]: { auth: true, schema: false, ctr: ctr.acc.del },
    [mthd.patch]: { auth: true, schema: sch.profUpd, ctr: ctr.acc.patch },
  },
  [endpt.pwd]: {
    [mthd.patch]: { auth: true, schema: sch.pwdPtch, ctr: ctr.acc.res },
  },
  [endpt.pwdReq]: {
    [mthd.post]: { auth: false, schema: sch.pwdReq, ctr: ctr.res.req },
  },
  [endpt.pwdRes]: {
    [mthd.post]: { auth: false, schema: sch.newPwd, ctr: ctr.res.prc },
  },
} as const;

const getRouteConfig = <S extends (typeof sch)[keyof typeof sch] | false>(
  ep: Endpoint,
  m: Method,
): Entr<S> => {
  const epRoutes = routeMap[ep];
  const conf = epRoutes[m as keyof typeof epRoutes];

  if (!conf) {
    throw new RequestError(
      `Method ${m} is not supported for ${ep} endpoint`,
      httpStatus.na,
    );
  }

  return conf;
};

export default getRouteConfig;
