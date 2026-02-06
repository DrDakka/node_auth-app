import dbHandler from './dbHandler.ts';
import parseCookies from './cookies.ts';
import jwtAction from './jwt.ts';
import setCorsHeaders from './cors.ts';

const utl = {
  dbh: dbHandler,
  jwt: jwtAction,
  prsCks: parseCookies,
  setCors: setCorsHeaders,
};

export default utl;
