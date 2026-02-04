import { TNAMES, type Tokens } from '../static/index.ts';

interface DBResUsr {
  id: string;
  name: string;
  email: string;
  password: string;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DBResTkn {
  id: string;
  userId: string;
  token: string;
  type: Tokens;
  expiresAt: Date;
  createdAt: Date;
}

interface DBResSN {
  id: string;
  userId: string;
  google: string | null;
  github: string | null;
  facebook: string | null;
}

type DBRes = {
  [TNAMES.USR]: DBResUsr;
  [TNAMES.SCN]: DBResSN;
  [TNAMES.TKN]: DBResTkn;
};

export type { DBRes, DBResTkn };
