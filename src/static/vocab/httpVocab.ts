const pages = {
  idx: '/',
  lgin: '/login',
  prof: '/profile',
  act: '/activate',
} as const;


const mthd = {
  get: 'GET',
  post: 'POST',
  del: 'DELETE',
  patch: 'PATCH',
} as const;

const httpStatus = {
  ok: 200,
  cr: 201,
  nc: 204,
  br: 400,
  nf: 404,
  na: 405,
  se: 500,
} as const;

type Method = typeof mthd[keyof typeof mthd];
type HTTPStatus = typeof httpStatus[keyof typeof httpStatus];

export { pages, mthd, httpStatus, type Method, type HTTPStatus };