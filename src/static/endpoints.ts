const endpt = {
  idx: '/', // get page
  auth: '/auth', // post user
  snauth: '/auth/social', // post user
  lgout: '/auth/logout', //
  reg: '/register', // techical endpoint '' '/' '/index.html'
  act: '/register/activate', // technical endpoint '/login/hash/'
  acc: '/profile', // profile, update profile, delete profile
  pwd: '/profile/password',
  pwdReq: '/password/reset-request', // res password
  pwdRes: '/password/reset',
} as const;

type Endpoint = typeof endpt[keyof typeof endpt]

export { endpt, type Endpoint };