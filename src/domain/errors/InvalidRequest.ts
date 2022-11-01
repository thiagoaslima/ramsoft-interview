import { CustomError, CustomErrorArgs } from '@lib/CustomError';

interface InvalidRequestErrorData<T> {
  request?: T;
}

interface InvalidRequestErrorArgs<T, TError> extends InvalidRequestErrorData<T> {
  message?: string;
  cause?: unknown;
  error?: TError;
}

export class InvalidRequestError<TData, TError = void> extends CustomError<TError, InvalidRequestErrorData<TData>> {
  static create<TData, TError>(args?: InvalidRequestErrorArgs<TData, TError>): InvalidRequestError<TData, TError> {
    return new InvalidRequestError(args?.message ?? 'Invalid request', {
      name: InvalidRequestError.name,
      cause: args?.cause,
      originalError: args?.error,
      data: {
        request: args?.request,
      },
    });
  }

  private constructor(message: string, options: CustomErrorArgs<TError, InvalidRequestErrorData<TData>>) {
    super(message, options);
  }
}
