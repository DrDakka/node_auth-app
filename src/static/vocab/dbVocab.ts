const ent = {
  usr: 'user',
  soc: 'soc',
  tkn: 'token',
} as const;

const tnames = {
  [ent.usr]: 'users',
  [ent.soc]: 'social_accounts',
  [ent.tkn]: 'tokens',
} as const;

const fnames = {
  [ent.usr]: {
    id: 'id',
    name: 'name',
    email: 'email',
    pwd: 'password',
    act: 'activated',
  },
  [ent.soc]: {
    id: 'id',
    usr: 'userId',
    ggl: 'google',
    gh: 'github',
    fb: 'facebook',
  },
  [ent.tkn]: {
    id: 'id',
    usr: 'userId',
    token: 'token',
    type: 'type',
    exp: 'expiresAt',
  },
} as const;

export { tnames, fnames, ent };
