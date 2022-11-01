import { CustomError, CustomErrorArgs } from '@lib/CustomError';

interface StorageQuotaExceededArgs {
  message?: string;
}

const StorageQuotaExceededErrorMessage =
  'The storage quota was exceeded. Please, remove some data before retrying to save.';

export class StorageQuotaExceededError extends CustomError {
  static create(args?: StorageQuotaExceededArgs): StorageQuotaExceededError {
    return new StorageQuotaExceededError(args?.message ?? StorageQuotaExceededErrorMessage, {
      name: StorageQuotaExceededError.name,
    });
  }

  private constructor(message: string, options: CustomErrorArgs) {
    super(message, options);
  }
}
