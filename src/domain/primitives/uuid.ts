import { z } from 'zod';
import { v4 } from 'uuid';

export const UUIDSchema = z.string().uuid().brand<'UUID'>();

export type UUID = z.infer<typeof UUIDSchema>;

export function isUUID(value: unknown): value is UUID {
  return UUIDSchema.safeParse(value).success;
}

export function createUUID(): UUID {
  const uuidValue = v4();
  return UUIDSchema.parse(uuidValue);
}
