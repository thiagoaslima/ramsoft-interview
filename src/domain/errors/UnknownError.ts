import { CustomError, CustomErrorArgs } from '@lib/CustomError';

type UnknownErrorArgs<TError> = {
  message?: string;
  cause?: unknown;
  originalError: TError;
};

export class UnknownError<TError = unknown> extends CustomError<TError> {
  static create<TError>(args: UnknownErrorArgs<TError>): UnknownError<TError> {
    return new UnknownError(args.message ?? 'Unknown error', {
      name: UnknownError.name,
      cause: args.cause,
      originalError: args.originalError,
    });
  }

  private constructor(message: string, options: CustomErrorArgs<TError>) {
    super(message, options);
  }
}
