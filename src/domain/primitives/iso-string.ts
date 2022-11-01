import { z } from 'zod';
import { isString, isValidDate } from '@lib/is';

export const ISOStringSchema = z
  .preprocess((value) => {
    if (isString(value)) {
      const date = new Date(value);

      if (isValidDate(date) && date.toISOString() === value) {
        return value;
      }
    }
  }, z.string())
  .brand<'ISOString'>();

export type ISOString = z.infer<typeof ISOStringSchema>;

export function isISOString(value: unknown): value is ISOString {
  return ISOStringSchema.safeParse(value).success;
}

export function createISOString(value: unknown): ISOString {
  return ISOStringSchema.parse(value);
}

export function getNowAsISOString(): ISOString {
  const now = new Date().toISOString();
  return createISOString(now);
}
