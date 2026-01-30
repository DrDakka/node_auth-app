import http from 'http';
import { dbSetup } from './db/db';
import { validateRequest } from './validation';
import { parseBody } from './middleware';
import getRouteConfig from './router/router';

// Options preflight
// query params in req
// Unified api response
// rate limiter mdw
// cookies parser
// JSW tokens

export async function createServer() {
  await dbSetup();

  return http.createServer(async (req, res) => {
    try {
      const { endpoint, method } = validateRequest(req);

      const { auth, schema, controller } = getRouteConfig(endpoint, method);

      if (auth) {
        const authHeader = req.headers.authorization;
        validateAuth(authHeader);
      }

      if (schema) {
        const body = await parseBody(req);
        validateBody(body, schema);
      }

      const result = controller(body);
    } catch (error) {
      
    }
  });
}
