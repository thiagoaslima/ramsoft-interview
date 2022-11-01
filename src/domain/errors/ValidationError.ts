import { z } from 'zod';
import { CustomError, CustomErrorArgs } from '@lib/CustomError';

interface ValidationErrorData {
  invalidData?: unknown;
}

interface ValidationErrorArgs<TError> extends ValidationErrorData {
  cause?: unknown;
  message?: string;
  error: TError;
}

export class ValidationError<TError = z.ZodError> extends CustomError<TError, ValidationErrorData> {
  static create<TError = z.ZodError>(args: ValidationErrorArgs<TError>): ValidationError<TError> {
    return new ValidationError(args.message ?? 'Data is invalid', {
      name: ValidationError.name,
      cause: args.cause,
      originalError: args.error,
      data: {
        invalidData: args.invalidData,
      },
    });
  }

  private constructor(message: string, options: CustomErrorArgs<TError, ValidationErrorData>) {
    super(message, options);
  }
}
