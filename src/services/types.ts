import { TKN, TNAMES } from "../static";

interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password: string;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TokenAttr {
  id: string,
  userId: string,
  token: string,
  type: TKN,
  expiresAt: Date,
  createdAt: Date,
}

interface SocialNetworkAttr {
  id: string,
  userId: string,
  google: string | null,
  github: string | null,
  facebook: string | null,
}

type ObjectMapType = {
  [TNAMES.USR]: UserAttributes;
  [TNAMES.SCN]: SocialNetworkAttr;
  [TNAMES.TKN]: TokenAttr;
}

export { type ObjectMapType };