import { fail, ok, Result } from '@lib/Result';
import { isError, isNull } from '@lib/is';

import { createUUID } from '@domain/primitives/uuid';
import { UnknownError, UnsupportedError } from '@domain/errors';
import { StorageDb, StorageDbStatic } from '@database/types/StorageDb';
import { StorageQuotaExceededError } from './errors/StorageQuotaExceededError';

const isQuotaExceededError = (error: unknown): boolean => {
  return isError(error) && ['QUOTA_EXCEEDED_ERR', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(error.name);
};

export class LocalStorageDb implements StorageDb, StorageDbStatic {
  static #instance: LocalStorageDb | undefined;

  static #isAvailable() {
    const randomKey = `ramsoft-test-localstorage-${createUUID()}`;

    try {
      globalThis.localStorage.setItem(randomKey, 'test-value');
      globalThis.localStorage.removeItem(randomKey);
      return true;
    } catch (err) {
      if (isQuotaExceededError(err)) {
        return true;
      }

      return false;
    }
  }

  static create(): LocalStorageDb {
    if (!LocalStorageDb.#isAvailable()) {
      throw UnsupportedError.create({
        message: 'Unable to persist data',
        cause: 'Local storage is not available',
        resourceName: 'window.localStorage',
      });
    }

    if (LocalStorageDb.#instance) {
      return LocalStorageDb.#instance;
    }

    const storage = new LocalStorageDb();
    LocalStorageDb.#instance = storage;
    return storage;
  }

  private constructor() {}

  save<T>(key: string, value: T): Result<void, StorageQuotaExceededError | UnknownError> {
    try {
      const stringifiedValue = JSON.stringify(value);
      window.localStorage.setItem(key, stringifiedValue);
      return ok();
    } catch (err) {
      if (isQuotaExceededError(err)) {
        return fail(StorageQuotaExceededError.create());
      }

      return fail(
        UnknownError.create({
          message: 'Unknown error when trying to save on local storage',
          originalError: err,
        }),
      );
    }
  }

  get<T>(key: string): Result<T | null, SyntaxError | UnknownError> {
    try {
      const stringifiedValue = window.localStorage.getItem(key);

      if (isNull(stringifiedValue)) {
        return ok(stringifiedValue);
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
      window.localStorage.removeItem(key);
      return ok();
    } catch (err) {
      return fail(
        UnknownError.create({
          message: 'Unknown error when trying to remove item from local storage',
          originalError: err,
        }),
      );
    }
  }

  clear(): Result<void, UnknownError> {
    try {
      window.localStorage.clear();
      return ok();
    } catch (err) {
      return fail(
        UnknownError.create({
          message: 'Unknown error when trying to remove item from local storage',
          originalError: err,
        }),
      );
    }
  }
}
