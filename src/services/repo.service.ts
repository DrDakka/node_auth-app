import { RequestError } from '../errors/index.ts';
import DB from '../model/index.ts';
import { fnames, httpStatus, type Tnames } from '../static/index.ts';
import { aDBH } from '../utils/index.ts';
import { type Create, type DBRes } from './types.ts';

const get = async <T extends Tnames>(
  table: T,
  key: string,
): Promise<DBRes[T]> => {
  const item = await DB[table].findByPk(key);

  if (!item) {
    throw new RequestError(
      `${table.slice(-1).toUpperCase()} not found: ${key}`,
      httpStatus.nf,
    );
  }

  return item.toJSON();
};

const del = async (table: Tnames, key: string): Promise<void> => {
  const item = await DB[table].findByPk(key);

  if (!item) {
    throw new RequestError(`Id not found: ${key}`, httpStatus.nf);
  }

  await item.destroy();
};

const getByParam = async <T extends Tnames>(
  table: T,
  field: (typeof fnames)[T][keyof (typeof fnames)[T]],
  query: string | boolean,
): Promise<DBRes[T]> => {
  const item = await DB[table].findOne({ where: { [field as string]: query } });

  if (!item) {
    throw new RequestError(
      `${table} with ${field}=${query} not found`,
      httpStatus.nf,
    );
  }

  return item.toJSON();
};

const create = async <T extends Exclude<Tnames, 'social_accounts'>>(
  table: T,
  data: Create[T],
): Promise<DBRes[T]> => {
  const newObj = await DB[table].create({
    ...data,
  });

  return newObj.toJSON();
};

// aDBH = asyncDBHandler, try/catch cover;

const base = {
  get: aDBH(<T extends Tnames>(t: T, k: string) => get(t, k)),
  del: aDBH((t: Tnames, k: string) => del(t, k)),
  getByPrm: aDBH(
    <T extends Tnames>(
      t: T,
      f: (typeof fnames)[T][keyof (typeof fnames)[T]],
      q: string,
    ) => getByParam(t, f, q),
  ),
  crt: aDBH(
    <T extends Exclude<Tnames, 'social_accounts'>>(t: T, d: Create[T]) =>
      create(t, d),
  ),
};

export { base };
