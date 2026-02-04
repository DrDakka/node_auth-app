import http from 'http';
import { z } from 'zod'

import { type Endpoint } from "./endpoints";
import { type Method, type HTTPStatus } from "./vocab/httpVocab";
import { JWTPayload } from '../utils';

type Ctx<S> = {
  req: http.IncomingMessage;
  res: http.ServerResponse;
  body: S extends z.ZodSchema ? z.infer<S> : false;
  usr: JWTPayload | null;
  param: string | null;
};

export type { Endpoint, Method, HTTPStatus, Ctx };