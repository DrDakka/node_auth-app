import { DBError, RequestError } from '../errors';
import DB from '../model';
import { fnames, httpStatus, TNAMES } from '../static';

const get = async (table: TNAMES, key: string) => {
  const item = await DB[table].findByPk(key);

  if (!item) {
    throw new RequestError(`Id not found: ${key}`, httpStatus.nf);
  }

  return item;
};

const del = async (table: TNAMES, key: string) => {
  const item = await get(table, key);

  item.destroy();
};

const getByParam = async <T extends TNAMES>(
  table: T,
  field: (typeof fnames)[T][keyof (typeof fnames)[T]],
  query: string,
) => {
  const item = await DB[table].findOne({ where: { [field as string]: query } });

  if (!item) {
    throw new RequestError(
      `${table} with ${field}=${query} not found`,
      httpStatus.nf,
    );
  }

  return item;
};

const create = async (table: TNAMES, obj) => {

}

export { get, del, getByParam };
