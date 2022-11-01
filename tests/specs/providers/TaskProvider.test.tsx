import { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { asThrowable } from '@lib/Result';

import { Task } from '@domain/entities/Task';
import { createISOString } from '@domain/primitives/iso-string';
import { InvalidRequestError, NotFoundError } from '@domain/errors';
import { StorageDb } from '@database/types/StorageDb';
import { LocalStorageDb } from '@database/storage/LocalStorage';
import { TaskProvider, TASKS_STORAGE_KEY, useTasks } from '@providers/TaskProvider';
import { testTaskObject } from 'tests/factories/Task.factory';
import { createUUID } from '@domain/primitives/uuid';

let storageInstance: StorageDb;

beforeEach(() => {
  storageInstance = LocalStorageDb.create();
});

afterEach(() => {
  storageInstance.clear();
});

const customRender = () =>
  renderHook(() => useTasks(), {
    wrapper: ({ children }: { children?: ReactNode }) => <TaskProvider>{children}</TaskProvider>,
  });

describe('TaskProvider', () => {
  describe('allTasks', () => {
    it('should start without tasks if storage is empty', () => {
      const { result } = customRender();

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([]);
      expect(storageValue).toBe(null);
    });

    it('should start without tasks if storage has an empty array', () => {
      const initialValue = {};

      storageInstance.save(TASKS_STORAGE_KEY, initialValue);
      const { result } = customRender();

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([]);
      expect(storageValue).toStrictEqual({});
    });

    it('should retrieve the tasks saved on storage', () => {
      const tasks: Task[] = [testTaskObject({ title: 'Task 1' }), testTaskObject({ title: 'Task 2' })];
      const initialValue = Object.fromEntries(tasks.map((task) => [task.id, task]));
      storageInstance.save(TASKS_STORAGE_KEY, initialValue);

      const { result } = customRender();

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual(tasks);
      expect(storageValue).toStrictEqual(initialValue);
    });
  });

  describe('getTask', () => {
    it('should return a task', () => {
      const tasks: Task[] = [
        testTaskObject({ title: 'Task 1' }),
        testTaskObject({ title: 'Task 2' }),
        testTaskObject({ title: 'Task 3' }),
      ];
      const initialValue = Object.fromEntries(tasks.map((task) => [task.id, task]));
      storageInstance.save(TASKS_STORAGE_KEY, initialValue);

      const { result } = customRender();

      let response: Task | null | undefined;

      act(() => {
        response = result.current.getTask(tasks[1].id);
      });
      expect(response).toStrictEqual(tasks[1]);
    });

    it('should return null for a non existing ids', () => {
      const tasks: Task[] = [
        testTaskObject({ title: 'Task 1' }),
        testTaskObject({ title: 'Task 2' }),
        testTaskObject({ title: 'Task 3' }),
      ];
      const initialValue = Object.fromEntries(tasks.map((task) => [task.id, task]));
      storageInstance.save(TASKS_STORAGE_KEY, initialValue);

      const { result } = customRender();

      let response: Task | null | undefined;

      act(() => {
        response = result.current.getTask(createUUID());
      });

      expect(response).toStrictEqual(null);
    });
  });

  describe('createTask', () => {
    it('should add a task to the empty tasks list and save it on storage', () => {
      const newTask = testTaskObject();
      const { result } = customRender();

      expect(result.current.allTasks).toStrictEqual([]);

      act(() => {
        result.current.createTask(newTask);
      });

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([newTask]);
      expect(storageValue).toStrictEqual({ [newTask.id]: newTask });
    });

    it('should push the new task to the pre existing tasks list (in memory and on storage)', () => {
      const existingTask = testTaskObject();
      const newTask = testTaskObject();
      storageInstance.save(TASKS_STORAGE_KEY, { [existingTask.id]: existingTask });

      const { result } = customRender();

      expect(result.current.allTasks).toStrictEqual([existingTask]);

      act(() => {
        result.current.createTask(newTask);
      });

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([existingTask, newTask]);
      expect(storageValue).toStrictEqual({
        [newTask.id]: newTask,
        [existingTask.id]: existingTask,
      });
    });

    it('should return error if sends an invalid task', () => {
      const invalidTask = {} as Task;

      const { result } = customRender();

      expect(result.current.allTasks).toStrictEqual([]);

      let error: Error | undefined;

      act(() => {
        const response = result.current.createTask(invalidTask);
        if (!response.success) {
          error = response.error;
        }
      });

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([]);
      expect(storageValue).toStrictEqual(null);
      expect(error).toBeInstanceOf(InvalidRequestError);
      expect(error?.message).toMatchInlineSnapshot('"Task cannot be created"');
      expect(error?.cause).toMatchInlineSnapshot('"Invalid properties on the task"');
    });

    it('should return error if a task with the same id already exists', () => {
      const task = testTaskObject();
      storageInstance.save(TASKS_STORAGE_KEY, { [task.id]: task });

      const { result } = customRender();

      expect(result.current.allTasks).toStrictEqual([task]);

      let error: Error | undefined;

      act(() => {
        const response = result.current.createTask(task);
        if (!response.success) {
          error = response.error;
        }
      });

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([task]);
      expect(storageValue).toStrictEqual({ [task.id]: task });
      expect(error).toBeInstanceOf(InvalidRequestError);
      expect(error?.message).toMatchInlineSnapshot('"Task cannot be created"');
      expect(error?.cause).toMatchInlineSnapshot('"Task already exists"');
    });
  });

  describe('updateTaskContent', () => {
    it('should update the task title', () => {
      const newTitle = 'Updated Task';
      const task = testTaskObject({
        deadline: createISOString('2022-01-01T20:20:20.200Z'),
      });
      storageInstance.save(TASKS_STORAGE_KEY, { [task.id]: task });

      const { result } = customRender();
      expect(result.current.allTasks).toStrictEqual([task]);

      let newTask: Task | undefined;

      act(() => {
        const response = result.current.updateTaskContent(task.id, {
          title: newTitle,
          description: task.description,
          deadline: task.deadline,
        });

        if (response.success) {
          newTask = response.data;
        }
      });

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([newTask]);
      expect(storageValue).toStrictEqual({ [task.id]: newTask });
      expect(newTask?.title).toBe(newTitle);
    });

    it('should update the task description', () => {
      const newDescription = 'Updated Task';
      const task = testTaskObject({
        deadline: createISOString('2022-01-01T20:20:20.200Z'),
      });
      storageInstance.save(TASKS_STORAGE_KEY, { [task.id]: task });

      const { result } = customRender();
      expect(result.current.allTasks).toStrictEqual([task]);

      let newTask: Task | undefined;

      act(() => {
        const response = result.current.updateTaskContent(task.id, {
          title: task.title,
          description: newDescription,
          deadline: task.deadline,
        });

        if (response.success) {
          newTask = response.data;
        }
      });

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([newTask]);
      expect(storageValue).toStrictEqual({ [task.id]: newTask });
      expect(newTask?.description).toBe(newDescription);
    });

    it('should update the task deadline', () => {
      const newDeadline = createISOString('2022-12-31T20:20:20.200Z');
      const task = testTaskObject({
        deadline: createISOString('2022-01-01T20:20:20.200Z'),
      });
      storageInstance.save(TASKS_STORAGE_KEY, { [task.id]: task });

      const { result } = customRender();
      expect(result.current.allTasks).toStrictEqual([task]);

      let newTask: Task | undefined;

      act(() => {
        const response = result.current.updateTaskContent(task.id, {
          title: task.title,
          description: task.description,
          deadline: newDeadline,
        });

        if (response.success) {
          newTask = response.data;
        }
      });

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([newTask]);
      expect(storageValue).toStrictEqual({ [task.id]: newTask });
      expect(newTask?.deadline).toBe(newDeadline);
    });

    it('should remove description and deadline from the task', () => {
      const task = testTaskObject({
        deadline: createISOString('2022-01-01T20:20:20.200Z'),
      });
      storageInstance.save(TASKS_STORAGE_KEY, { [task.id]: task });

      const { result } = customRender();
      expect(result.current.allTasks).toStrictEqual([task]);

      let newTask: Task | undefined;

      act(() => {
        const response = result.current.updateTaskContent(task.id, {
          title: task.title,
        });

        if (response.success) {
          newTask = response.data;
        }
      });

      const storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([newTask]);
      expect(storageValue).toStrictEqual({ [task.id]: newTask });
      expect(newTask?.description).toBeUndefined();
      expect(newTask?.deadline).toBeUndefined();
    });
  });

  describe('removeTask', () => {
    it('should remove an existing task', () => {
      const task = testTaskObject();
      storageInstance.save(TASKS_STORAGE_KEY, { [task.id]: task });

      const { result } = customRender();
      let storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([task]);
      expect(storageValue).toStrictEqual({ [task.id]: task });

      let removedTask: Task | undefined;

      act(() => {
        const response = result.current.removeTask(task.id);

        if (response.success) {
          removedTask = response.data;
        }
      });

      storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([]);
      expect(storageValue).toStrictEqual({});
      expect(removedTask).toStrictEqual(task);
    });

    it('should return an error if task does not exist', () => {
      const task = testTaskObject();

      const { result } = customRender();
      let storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([]);
      expect(storageValue).toStrictEqual(null);

      let error: NotFoundError | undefined;

      act(() => {
        const response = result.current.removeTask(task.id);

        if (!response.success) {
          error = response.error;
        }
      });

      storageValue = asThrowable(storageInstance.get(TASKS_STORAGE_KEY));

      expect(result.current.allTasks).toStrictEqual([]);
      expect(storageValue).toStrictEqual(null);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error?.message).toMatchInlineSnapshot('"Task can not be removed."');
      expect(error?.cause).toBe(`Task ${task.id} does not exist.`);
    });
  });
});
