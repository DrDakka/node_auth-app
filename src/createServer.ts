import http from 'http';
import bcrypt from 'bcrypt';
import { dbSetup } from './db/db.ts';
import { validateBody, validateRequest } from './validation/index.ts';
import mw from './middleware/index.ts';
import getRouteConfig from './router/router.ts';
import { type Ctx } from './static/types.ts';
import { TNAMES } from './static/index.ts';
import DB from './model/index.ts';

// Options preflight
// Unified api response

export async function createServer() {
  await dbSetup();

  const createUsr = async (usr: {
    name: string;
    email: string;
    password: string;
    activated: boolean;
  }) => {
    await DB[TNAMES.USR].create({
      ...usr,
    });
  };

  const pwds = ['jdfu70sdf', 'jdddu70sdf', 'jdgfdfd70sdf'];
  const testUsrs = [
    {
      name: 'JohnDoe',
      email: 'gtlafuk@iksf.fsd',
      password: await bcrypt.hash(pwds[0], 10),
      activated: true,
    },
    {
      name: 'Yurgen',
      email: 'gtlasdk@iksf.fsd',
      password: await bcrypt.hash(pwds[1], 10),
      activated: true,
    },
    {
      name: 'JosdnDoe',
      email: 'gtsdgasfuk@iksf.fsd',
      password: await bcrypt.hash(pwds[2], 10),
      activated: true,
    },
  ];

  await testUsrs.map((el) => createUsr(el));

  return http.createServer(async (req, res) => {
    try {
      const { endpoint, method, param } = validateRequest(req);

      const { auth, schema, ctr } = getRouteConfig(endpoint, method);
      let usr = null;

      if (auth) {
        usr = mw.tokenAuth(req);
      }

      const body = schema ? validateBody(await mw.parseB(req), schema) : false;

      const ctx: Ctx<typeof schema> = {
        req,
        res,
        body,
        usr,
        param,
      };

      await ctr(ctx);
    } catch (e) {
      mw.error(res, e);
    }
  });
}
