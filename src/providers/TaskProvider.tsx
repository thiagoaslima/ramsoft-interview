import { createContext, FC, ReactNode, useCallback, useContext, useMemo } from 'react';
import structuredClone from '@ungap/structured-clone';
import { ok, fail, Result } from '@lib/Result';

import { createUUID } from '@domain/primitives/uuid';
import { getNowAsISOString } from '@domain/primitives/iso-string';
import { createTask as createTaskEntity, Task, UnregisteredTask } from '@domain/entities/Task';
import { InvalidRequestError, NotFoundError, UnknownError, UnsupportedError, ValidationError } from '@domain/errors';

import { useStorage } from '@hooks/useStorage';
import { removeUndefinedProps } from '@lib/removeUndefinedProps';

interface TaskContext {
  allTasks: Task[];
  getTask: (taskId: Task['id']) => Task | null;
  createTask: (
    task: UnregisteredTask,
  ) => Result<Task, InvalidRequestError<UnregisteredTask, ValidationError | Error | void> | UnknownError>;
  updateTaskContent: (
    taskId: Task['id'],
    update: Pick<Task, 'title' | 'description' | 'deadline'>,
  ) => Result<
    Task,
    | NotFoundError
    | InvalidRequestError<
        { taskId: Task['id']; update: Pick<Task, 'title' | 'description' | 'deadline'> },
        ValidationError
      >
  >;
  removeTask: (taskId: Task['id']) => Result<Task, NotFoundError>;
}

const taskContext = createContext<TaskContext | null>(null);

interface TaskProviderProps {
  children?: ReactNode;
}

export const TASKS_STORAGE_KEY = 'tasks';

export const TaskProvider: FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useStorage<Record<Task['id'], Task>>(TASKS_STORAGE_KEY, {});

  const allTasks = useMemo(() => {
    return Object.values(tasks);
  }, [tasks]);

  const getTask = useCallback(
    (taskId: Task['id']): Task | null => {
      return tasks[taskId] ?? null;
    },
    [tasks],
  );

  const createTask = useCallback(
    (
      task: UnregisteredTask,
    ): Result<Task, InvalidRequestError<UnregisteredTask, ValidationError | Error | void> | UnknownError> => {
      const newTaskResult = createTaskEntity({
        id: createUUID(),
        ...task,
      });

      if (!newTaskResult.success) {
        return fail(
          InvalidRequestError.create({
            message: 'Task cannot be created',
            cause: 'Invalid properties on the task',
            error: newTaskResult.error.originalError,
            request: task,
          }),
        );
      }

      const newTask = newTaskResult.data;

      if (tasks[newTask.id]) {
        return fail(
          InvalidRequestError.create<Task, void>({
            message: 'Task cannot be created',
            cause: 'Task already exists',
            request: newTask,
          }),
        );
      }

      setTasks((tasks) => ({
        ...tasks,
        [newTask.id]: newTask,
      }));

      return ok(newTask);
    },
    [setTasks, tasks],
  );

  const updateTaskContent = useCallback(
    (
      taskId: Task['id'],
      update: Pick<Task, 'title' | 'description' | 'deadline'>,
    ): Result<
      Task,
      | NotFoundError
      | InvalidRequestError<
          { taskId: Task['id']; update: Pick<Task, 'title' | 'description' | 'deadline'> },
          ValidationError
        >
    > => {
      const currentTask = tasks[taskId];

      if (!currentTask) {
        return fail(
          NotFoundError.create({
            message: `Task can not be updated.`,
            cause: `Task ${taskId} does not exist.`,
          }),
        );
      }

      const newTaskResult = createTaskEntity(
        removeUndefinedProps({
          id: currentTask.id,
          title: update.title,
          description: update.description,
          deadline: update.deadline,
          createdAt: currentTask.createdAt,
          updatedAt: getNowAsISOString(),
        }),
      );

      if (!newTaskResult.success) {
        return fail(
          InvalidRequestError.create({
            message: `Task can not be updated.`,
            cause: 'Invalid properties on the task update.',
            error: newTaskResult.error,
            request: { taskId, update },
          }),
        );
      }

      const newTask = newTaskResult.data;

      setTasks((tasks) => ({
        ...tasks,
        [newTask.id]: newTask,
      }));

      return ok(newTask);
    },
    [setTasks, tasks],
  );

  const removeTask = useCallback(
    (taskId: Task['id']): Result<Task, NotFoundError> => {
      const currentTask = tasks[taskId];

      if (!currentTask) {
        return fail(
          NotFoundError.create({
            message: `Task can not be removed.`,
            cause: `Task ${taskId} does not exist.`,
          }),
        );
      }

      setTasks((tasks) => {
        const copy = structuredClone(tasks);
        delete copy[taskId];
        return copy;
      });

      return ok(currentTask);
    },
    [setTasks, tasks],
  );

  const ctx = {
    allTasks,
    getTask,
    createTask,
    updateTaskContent,
    removeTask,
  };

  return <taskContext.Provider value={ctx}>{children}</taskContext.Provider>;
};

export const useTasks = (): TaskContext => {
  const context = useContext(taskContext);

  if (!context) {
    throw UnsupportedError.create({
      message: 'No task context found',
      cause: 'An TaskProvider parent is required to use useTasks',
      resourceName: 'taskContext',
    });
  }

  return context;
};
