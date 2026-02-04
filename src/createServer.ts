import http from 'http';
import { dbSetup } from './db/db';
import { validateBody, validateRequest } from './validation';
import { errorHandler, parseBody } from './middleware';
import getRouteConfig from './router/router';
import { authTkn } from './controllers';
import { Ctx } from './static/types';

// Options preflight
// Unified api response

export async function createServer() {
  await dbSetup();

  return http.createServer(async (req, res) => {
    try {
      const { endpoint, method, param } = validateRequest(req);

      const { auth, schema, ctr } = getRouteConfig(endpoint, method);
      let usr = null;

      if (auth) {
        usr = authTkn(req);
      }

      const body = schema ? validateBody(await parseBody(req), schema) : false;

      const ctx: Ctx<typeof schema> = {
        req,
        res,
        body,
        usr,
        param,
      };

      ctr(ctx);
    } catch (e) {
      errorHandler(res, e);
    }
  });
}
