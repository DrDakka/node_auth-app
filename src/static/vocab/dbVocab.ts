enum  TNAMES {
  USR = 'users',
  SCN = 'social_accounts',
  TKN = 'tokens',
};

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

enum TKN {
  ACT = 'activation',
  RFR = 'refresh',
  PWR = 'password_reset',
  ACC = 'access',
}

export { TNAMES, fnames, TKN };
