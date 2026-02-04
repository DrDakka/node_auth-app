const TNAMES = {
  USR: 'users',
  SCN: 'social_accounts',
  TKN: 'tokens',
} as const;

type Tnames = (typeof TNAMES)[keyof typeof TNAMES];

const fnames = {
  [TNAMES.USR]: {
    id: 'id',
    name: 'name',
    email: 'email',
    pwd: 'password',
    act: 'activated',
  },
  [TNAMES.SCN]: {
    id: 'id',
    usr: 'userId',
    ggl: 'google',
    gh: 'github',
    fb: 'facebook',
  },
  [TNAMES.TKN]: {
    id: 'id',
    usr: 'userId',
    token: 'token',
    type: 'type',
    exp: 'expiresAt',
  },
} as const;

const TKN = {
  ACT: 'activation',
  RFR: 'refresh',
  PWR: 'password_reset',
  ACC: 'access',
} as const;

type Tokens = (typeof TKN)[keyof typeof TKN];

export { TNAMES, fnames, TKN };
export type { Tokens, Tnames };
