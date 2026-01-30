import http from 'http';
import { RequestError } from '../errors';
import { httpStatus, mthd, endpt } from '../static';
import { type Method, type Endpoint } from '../static/types';

const validatePath = (path: string): path is Endpoint => {
  return Object.values(endpt).some((el) => el === path);
};

const validateMethod = (method: string | undefined): method is Method => {
  return Object.values(mthd).some((el) => el === method);
};

function validateRequest(req: http.IncomingMessage) {
  // check if URL
  if (!req.url) {
    throw new RequestError('Expected request URL', httpStatus.br);
  }
  const url = new URL(req.url, 'http://localhost');
  // validate endpoint
  const endpoint = url.pathname;
  if (!validatePath(endpoint)) {
    throw new RequestError('Not found', httpStatus.nf);
  }

  // validate method
  const method = req.method;
  if (!validateMethod(method)) {
    throw new RequestError(`Unknown method: ${method}`, httpStatus.br);
  }

  return { endpoint, method };
}

export { validateRequest };
