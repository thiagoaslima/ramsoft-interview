import { fail, ok, Result } from '@lib/Result';
import { isError, isNull, isUndefined } from '@lib/is';

import { UnknownError } from '@domain/errors';
import { StorageDb, StorageDbStatic } from '@database/types/StorageDb';

export class MemoryStorageDb implements StorageDb, StorageDbStatic {
  static #instance: MemoryStorageDb | undefined;

  static create(): MemoryStorageDb {
    if (MemoryStorageDb.#instance) {
      return MemoryStorageDb.#instance;
    }

    const storage = new MemoryStorageDb();
    MemoryStorageDb.#instance = storage;
    return storage;
  }

  #map = new Map<string, unknown>();

  private constructor() {}

  save<T>(key: string, value: T): Result<void, UnknownError> {
    try {
      this.#map.set(key, value);
      return ok();
    } catch (err) {
      return fail(
        UnknownError.create({
          message: 'Unknown error when trying to save on memory storage',
          originalError: err,
        }),
      );
    }
  }

  get<T>(key: string): Result<T | null, SyntaxError | UnknownError> {
    try {
      const stringifiedValue = window.localStorage.getItem(key);

      if (stringifiedValue === 'undefined') {
        throw new SyntaxError(`${stringifiedValue} is not parseable.`);
      }

      if (isNull(stringifiedValue) || isUndefined(stringifiedValue)) {
        return ok(null);
      }

      const parsedValue = JSON.parse(stringifiedValue) as T;
      return ok(parsedValue);
    } catch (err) {
      if (isError(err)) {
        if (err instanceof SyntaxError) {
          return fail(err);
        }
      }

      return fail(
        UnknownError.create({
          message: 'Unknown error when trying to get item from local storage',
          originalError: err,
        }),
      );
    }
  }

  remove(key: string): Result<void, UnknownError> {
    try {
      this.#map.delete(key);
      return ok();
    } catch (err) {
      return fail(
        UnknownError.create({
          message: 'Unknown error when trying to remove item from memory storage',
          originalError: err,
        }),
      );
    }
  }

  clear(): Result<void, UnknownError> {
    try {
      this.#map.clear();
      return ok();
    } catch (err) {
      return fail(
        UnknownError.create({
          message: 'Unknown error when trying to remove item from memory storage',
          originalError: err,
        }),
      );
    }
  }
}
