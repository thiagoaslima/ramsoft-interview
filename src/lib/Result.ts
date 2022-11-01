import { isUndefined } from '@lib/is';

type SuccessResponse<T = void> = {
  success: true;
  data: T;
};

type FailResponse<T> = {
  success: false;
  error: T;
};

export type Result<TData, TError = never> = SuccessResponse<TData> | FailResponse<TError>;

export function fail<T extends Error>(error: T): FailResponse<T> {
  return { success: false, error };
}

export function ok(): SuccessResponse<void>;
export function ok<T extends undefined>(value: T): SuccessResponse<void>;
export function ok<T>(value: T): SuccessResponse<T>;
export function ok<T>(value?: T): SuccessResponse<void> | SuccessResponse<T> {
  if (isUndefined(value)) {
    return { success: true, data: undefined };
  }

  return { success: true, data: value };
}

export const asThrowable = <TData, TError>(result: Result<TData, TError>): TData => {
  if (result.success) {
    return result.data;
  }

  throw result.error;
};
