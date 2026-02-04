import { httpStatus } from '../static';
import { type HTTPStatus } from '../static/types';

class CustomError extends Error {
  statusCode: HTTPStatus;
  
  constructor(message: string, statusCode: HTTPStatus = httpStatus.br) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class RequestError extends CustomError {
  constructor(message: string, statusCode: HTTPStatus) {
    super(message, statusCode);
  }
}

class DBError extends CustomError {
  constructor(message: string) {
    super(message, httpStatus.se);
  }
}

class AuthError extends CustomError {
  constructor(message: string) {
    super(message, httpStatus.na);
  }
}

export { RequestError, DBError, AuthError, CustomError };
