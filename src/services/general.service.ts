import { RequestError } from '../errors/index.ts';
import DB from '../model/index.ts';
import { fnames, httpStatus, type Tnames } from '../static/index.ts';
import { type DBRes } from './types.ts';

const get = async <T extends Tnames>(
  table: T,
  key: string,
): Promise<DBRes[T]> => {
  const item = await DB[table].findByPk(key);

  if (!item) {
    throw new RequestError(`Id not found: ${key}`, httpStatus.nf);
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

export { get, del, getByParam };
