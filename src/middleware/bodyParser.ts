import http from 'http';
import { BodyNotJSONError, MaxSizeError, RequestCancelledError } from '../errors/errors';
const maxSizeLimit = 1048576;

async function parseBody(req: http.IncomingMessage, maxSize = maxSizeLimit) {
  return new Promise((resolve, reject) => {
    let data = '';
    let size = 0;
    let settled = false;

    req.on('error', (err) => {
      if (!settled) {
        settled = true;
        reject(err);
      }
    });

    req.on('data', (chunk) => {
      if (settled) {
        return;
      }

      size += chunk.length;

      if (size > maxSize && !settled) {
        settled = true;
        req.destroy();
        reject(new MaxSizeError());

        return;
      }

      data += chunk;
    });

    req.on('end', () => {
      if (settled) {
        return;
      }

      try {
        settled = true;

        const res = JSON.parse(data);

        resolve(res);
      } catch {
        if (!settled) {
          settled = true;
          reject(new BodyNotJSONError());
        }
      }
    });

    req.on('close', () => {
      if (!settled) {
        settled = true;
        reject(new RequestCancelledError());
      }
    });
  });
}

export { parseBody };
