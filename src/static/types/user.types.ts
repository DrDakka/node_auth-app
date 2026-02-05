interface DBUser {
  id: string;
  name: string;
  email: string;
  password: string;
  activated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type DTOUser = Omit<
  DBUser,
  'password' | 'activated' | 'createdAt' | 'updatedAt'
>;

type PatchUser = Omit<DBUser, 'id' | 'createdAt' | 'updatedAt'>;

type CreateUser = Omit<DBUser, 'id' | 'activated' | 'createdAt' | 'updatedAt'>;

export type { DBUser, DTOUser, PatchUser, CreateUser };
