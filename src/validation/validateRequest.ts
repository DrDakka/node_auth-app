import http from 'http';
import { ValidationError, NotFoundError } from '../errors/errors';
import { httpStatus, mthd, endpt } from '../static';
import { type Method, type Endpoint } from '../static/types';
import { getRouteConfig } from '../router/router';

const validatePath = (path: string): path is Endpoint => {
  return Object.values(endpt).some((el) => el === path);
};

const validateMethod = (method: string | undefined): method is Method => {
  return Object.values(mthd).some((el) => el === method);
};

function validateRequest(req: http.IncomingMessage) {
  // check if URL
  if (!req.url) {
    throw new ValidationError('Expected request URL', httpStatus.br);
  }
  const url = new URL(req.url, 'http://localhost');
  // validate endpoint
  const endpoint = url.pathname;
  if (!validatePath(endpoint)) {
    throw new NotFoundError();
  }

  // validate method
  const method = req.method;
  if (!validateMethod(method)) {
    throw new ValidationError(`Unknown method: ${method}`, httpStatus.br);
  }

  // validate enpoint support method && get conf

  const config = getRouteConfig(endpoint, method);

  return config;
}

export { validateRequest };
