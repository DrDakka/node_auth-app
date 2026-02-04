import { DBError, RequestError } from '../errors';
import DB from '../model';
import { fnames, httpStatus, TNAMES } from '../static';
import { DBRes } from './types';

const get = async <T extends TNAMES>(table: T, key: string): Promise<DBRes[T]> => {
  const item = await DB[table].findByPk(key);

  if (!item) {
    throw new RequestError(`Id not found: ${key}`, httpStatus.nf);
  }

  return item.toJSON();
};

const del = async (table: TNAMES, key: string): Promise<void> => {

  const item = await DB[table].findByPk(key);

  if (!item) {
    throw new RequestError(`Id not found: ${key}`, httpStatus.nf);
  }

  await item.destroy();
};

const getByParam = async <T extends TNAMES>(
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
