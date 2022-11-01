import { isError, isString } from '@lib/is';

export type CustomErrorArgs<TError = void, TData = void> = {
  name: string;
  cause?: unknown;
  originalError?: TError;
  data?: TData;
};

export abstract class CustomError<TError = void, TData = void> extends Error {
  readonly name: string;
  readonly message: string;
  readonly cause?: unknown;
  readonly originalError?: TError;
  readonly data?: TData;

  constructor(message: string, customErrorArgs: string | CustomErrorArgs<TError, TData>) {
    const name = isString(customErrorArgs) ? customErrorArgs : customErrorArgs.name;
    const { data, originalError, cause } = !isString(customErrorArgs)
      ? customErrorArgs
      : ({} as Omit<CustomErrorArgs<TError, TData>, 'name'>);

    super(message, { cause });
    this.name = name;
    this.message = message;
    this.cause = cause;
    this.data = data;
    this.originalError = originalError;

    if (isError(originalError)) {
      this.stack = originalError.stack;
    }
  }
}
