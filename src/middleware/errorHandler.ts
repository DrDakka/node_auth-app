import http from 'http';
import { httpStatus } from '../static/index.ts';
import { CustomError } from '../errors/index.ts';

function errorHandler(res: http.ServerResponse, e: unknown) {
  if (e instanceof CustomError) {
    res.statusCode = e.statusCode;
    res.end(e.message);

    return;
  }

  res.statusCode = httpStatus.se;
  res.end('Unexpected server error');
}

export default errorHandler;
