import { Result } from '@lib/Result';

import { UnknownError } from '@domain/errors';
import { StorageQuotaExceededError } from '@database/storage/errors/StorageQuotaExceededError';

export abstract class StorageDbStatic {
  static create: () => StorageDb;
}

export interface StorageDb {
  save<T>(key: string, value: T): Result<void, StorageQuotaExceededError | UnknownError>;
  get<T>(key: string): Result<T | null, SyntaxError | UnknownError>;
  remove(key: string): Result<void, UnknownError>;
  clear(): Result<void, UnknownError>;
}
