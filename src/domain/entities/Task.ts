import { z } from 'zod';
import { Result, fail } from '@lib/Result';
import { UUID, UUIDSchema } from '@domain/primitives/uuid';
import { ISOString, ISOStringSchema } from '@domain/primitives/iso-string';
import { ValidationError } from '@domain/errors';

export const TaskSchema = z.object({
  id: UUIDSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  deadline: ISOStringSchema.optional(),
  createdAt: ISOStringSchema.optional().default(() => {
    const isoString = new Date().toISOString();
    return isoString as ISOString;
  }),
  updatedAt: ISOStringSchema.optional().default(() => {
    const isoString = new Date().toISOString();
    return isoString as ISOString;
  }),
});

export const UnregisteredTaskSchema = TaskSchema.partial({ id: true, createdAt: true, updatedAt: true });

export type Task = z.infer<typeof TaskSchema>;
export type UnregisteredTask = z.infer<typeof UnregisteredTaskSchema>;

export function isTask(value: unknown): value is Task {
  return TaskSchema.safeParse(value).success;
}

export function createTask(task: {
  id: string | UUID;
  title: string;
  description?: string;
  deadline?: string | ISOString;
  createdAt?: string | ISOString;
  updatedAt?: string | ISOString;
}): Result<Task, ValidationError<z.ZodError<Task>>> {
  const result = TaskSchema.safeParse(task);

  if (result.success) {
    return result;
  }

  return fail(
    ValidationError.create({
      message: 'Invalid task',
      error: result.error,
      invalidData: task,
    }),
  );
}

export function isUnregisteredTask(value: unknown): value is UnregisteredTask {
  return UnregisteredTaskSchema.safeParse(value).success;
}

export function createUnregisteredTask(task: {
  id?: string;
  title: string;
  description?: string;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}): Result<UnregisteredTask, ValidationError<z.ZodError<UnregisteredTask>>> {
  const result = UnregisteredTaskSchema.safeParse(task);

  if (result.success) {
    return result;
  }

  return fail(
    ValidationError.create({
      message: 'Invalid unregistered task',
      error: result.error,
      invalidData: task,
    }),
  );
}
