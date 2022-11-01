import { createTask, Task } from '@domain/entities/Task';
import { createUUID } from '@domain/primitives/uuid';
import { asThrowable } from '@lib/Result';

export const testTaskObject = (options?: Partial<Task>): Task => {
  const taskResult = createTask({
    id: createUUID(),
    title: 'Task example',
    description: 'Task description',
    ...options,
  });

  return asThrowable(taskResult);
};
