import { fnames, TNAMES } from "../static";

const nms = fnames[TNAMES.USR];

type JWTPayload = {
  [nms.id]: string;
  [nms.name]: string;
  [nms.email]: string;
};

export type { JWTPayload };