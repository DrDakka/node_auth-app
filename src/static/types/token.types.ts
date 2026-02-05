import { TKN, type Tokens } from '../index.ts';

interface DBToken {
  id: string;
  userId: string;
  token: string;
  type: Tokens;
  expiresAt: Date;
  createdAt: Date;
}

interface CreateTKN
  extends Omit<DBToken, 'id' | 'type' | 'createdAt' | 'expiresAt'> {
  type: Exclude<Tokens, typeof TKN.ACC>;
  expiresAt: string;
}

export type { DBToken, CreateTKN };
