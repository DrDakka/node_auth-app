import { httpStatus } from '../static';
import { type HTTPStatus } from '../static/types';

enum StaticErrorsMsgs {
  nf = 'Not found',
  na = 'Method not allowed',
  ms = 'Exceeded body size limits',
  br = 'Bad request',
  bnj = 'Expected body to be JSON',
  rc = 'Request cancelled',
}

class ValidationError extends Error {
  statusCode: HTTPStatus;

  constructor(message: string, statusCode: HTTPStatus) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class NotFoundError extends Error {
  statusCode: HTTPStatus;

  constructor() {
    super(StaticErrorsMsgs.nf);
    this.statusCode = httpStatus.nf;
    this.name = this.constructor.name;
  }
}

class NotAllowedError extends Error {
  statusCode: HTTPStatus;

  constructor() {
    super(StaticErrorsMsgs.na);
    this.statusCode = httpStatus.na;
    this.name = this.constructor.name;
  }
}

class MaxSizeError extends Error {
  statusCode: HTTPStatus;

  constructor() {
    super(StaticErrorsMsgs.ms);
    this.statusCode = httpStatus.br;
    this.name = this.constructor.name;
  }
}

class BodyNotJSONError extends Error {
  statusCode: HTTPStatus;

  constructor() {
    super(StaticErrorsMsgs.bnj);
    this.statusCode = httpStatus.br;
    this.name = this.constructor.name;
  }
}

class RequestCancelledError extends Error {
  statusCode: HTTPStatus;

  constructor() {
    super(StaticErrorsMsgs.rc);
    this.statusCode = httpStatus.br;
    this.name = this.constructor.name;
  }
}

export { 
  ValidationError,
  NotFoundError,
  RequestCancelledError,
  NotAllowedError,
  MaxSizeError,
  BodyNotJSONError 
};
