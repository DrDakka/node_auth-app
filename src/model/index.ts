import User from './user.model.ts';
import SocialAccount from './socialAccounts.model.ts';
import Token from './token.model.ts';
import { TNAMES } from '../static/index.ts';

const DB = {
  [TNAMES.USR]: User,
  [TNAMES.SCN]: SocialAccount,
  [TNAMES.TKN]: Token,
};

export default DB;
