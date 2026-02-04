import { TKN, type Tokens } from './index.ts';

const TOKEN_EXPIRY: Record<Tokens, [string, string]> = {
  [TKN.ACC]: ['15m', '900'],
  [TKN.RFR]: ['7d', '604800'],
  [TKN.ACT]: ['24h', '86400'],
  [TKN.PWR]: ['1h', '3600'],
};

export { TOKEN_EXPIRY };
