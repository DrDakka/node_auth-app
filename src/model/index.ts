import User from './user.model';
import SocialAccount from './socialAccounts.model';
import Token from './token.model';
import { TNAMES } from '../static';

const DB = {
  [TNAMES.USR]: User,
  [TNAMES.SCN]: SocialAccount,
  [TNAMES.TKN]: Token,
}

export default DB;
