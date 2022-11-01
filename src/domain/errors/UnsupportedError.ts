import { CustomError, CustomErrorArgs } from '@lib/CustomError';

interface UnsupportedErrorData {
  resourceName?: string | string[];
}

interface UnsupportedErrorArgs extends UnsupportedErrorData {
  message?: string;
  cause?: unknown;
}

export class UnsupportedError extends CustomError<void, UnsupportedErrorData> {
  static create(args?: UnsupportedErrorArgs): UnsupportedError {
    return new UnsupportedError(args?.message ?? 'Resource is not supported', {
      name: UnsupportedError.name,
      cause: args?.cause,
      data: {
        resourceName: args?.resourceName,
      },
    });
  }

  private constructor(message: string, options: CustomErrorArgs<void, UnsupportedErrorData>) {
    super(message, options);
  }
}
