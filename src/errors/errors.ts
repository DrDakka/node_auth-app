import { httpStatus } from '../static';
import { type HTTPStatus } from '../static/types';

class RequestError extends Error {
  statusCode: HTTPStatus;

  constructor(message: string, statusCode: HTTPStatus) {
    super();
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.message = message;
  }
}

class DBError extends Error {
  statusCode: HTTPStatus;

  constructor(message: string) {
    super();
    this.statusCode = httpStatus.se;
    this.name = this.constructor.name;
    this.message = message;
  }
}

class AuthError extends Error {
  statusCode: HTTPStatus;

  constructor(message: string) {
    super();
    this.statusCode = httpStatus.na;
    this.name = this.constructor.name;
    this.message = message;
  }
}

export { RequestError, DBError, AuthError };
