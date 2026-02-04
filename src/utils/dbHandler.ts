import { DBError } from '../errors/index.ts';

function asyncDBHandler<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw new DBError(
        `Database operation failed: ${error instanceof Error ? error.message : error}`,
      );
    }
  };
}

export default asyncDBHandler;
