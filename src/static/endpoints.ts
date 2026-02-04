const endpt = {
  idx: '/',
  auth: '/auth',
  refr: '/auth/refresh',
  snauth: '/auth/social',
  lgout: '/auth/logout',
  reg: '/register',
  act: '/register/activate',
  acc: '/profile',
  pwd: '/profile/password',
  pwdReq: '/password/reset-request',
  pwdRes: '/password/reset',
} as const;

type Endpoint = typeof endpt[keyof typeof endpt]

export { endpt, type Endpoint };