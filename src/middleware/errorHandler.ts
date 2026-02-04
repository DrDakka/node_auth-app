import http from 'http';
import { httpStatus } from '../static';
import { CustomError } from '../errors';

function errorHandler(res: http.ServerResponse, e: unknown) {
  if (e instanceof CustomError) {
    res.statusCode = e.statusCode;
    res.end(e.message);
  }

  res.statusCode = httpStatus.se;
  res.end('Unexpected server error');

  return;
}

export default errorHandler;