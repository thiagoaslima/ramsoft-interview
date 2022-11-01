import { CustomError, CustomErrorArgs } from '@lib/CustomError';

interface NotFoundErrorData {
  resourceName?: string | string[];
}

interface NotFoundErrorArgs extends NotFoundErrorData {
  message?: string;
  cause?: unknown;
}

export class NotFoundError extends CustomError<void, NotFoundErrorData> {
  static create(args?: NotFoundErrorArgs): NotFoundError {
    return new NotFoundError(args?.message ?? 'Resource not found', {
      name: NotFoundError.name,
      cause: args?.cause,
      data: {
        resourceName: args?.resourceName,
      },
    });
  }

  private constructor(message: string, options: CustomErrorArgs<void, NotFoundErrorData>) {
    super(message, options);
  }
}
