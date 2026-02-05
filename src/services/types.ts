import type {
  CreateTKN,
  CreateUser,
  DBToken,
  DBUser,
} from '../static/types/index.ts';
import { TNAMES } from '../static/index.ts';

interface DBResSN {
  id: string;
  userId: string;
  google: string | null;
  github: string | null;
  facebook: string | null;
}

type DBRes = {
  [TNAMES.USR]: DBUser;
  [TNAMES.SCN]: DBResSN;
  [TNAMES.TKN]: DBToken;
};

type Create = {
  [TNAMES.USR]: CreateUser;
  [TNAMES.TKN]: CreateTKN;
};

export type { DBRes, Create };
