import http from 'http';
import { dbSetup } from './db/db';
import { validateRequest } from './validation';
import { parseBody, validateAuth } from './middleware';
import getRouteConfig from './router/router';

// Options preflight
// Unified api response
// rate limiter mdw
// cookies parser
// JSW tokens

export async function createServer() {
  await dbSetup();

  return http.createServer(async (req, res) => {
    try {
      const { endpoint, method, param } = validateRequest(req);

      const { auth, schema, controller } = getRouteConfig(endpoint, method);

      let body = null;
      if (auth) {
        const authHeader = req.headers.authorization;

        body = validateAuth(authHeader);
      }

      if (schema) {
        body = await parseBody(req);
        validateBody(body, schema);
      }

      const result = controller(body);
    } catch (error) {}
  });
}
