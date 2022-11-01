import { describe, expect, it, vi, afterAll, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createUUID } from '@domain/primitives/uuid';
import { TaskProvider } from '@providers/TaskProvider';
import App from '@components/App';
import { getMemoryRouter } from 'tests/utils/getMemoryRouter';

vi.mock('@providers/TaskProvider', async () => {
  const module = await vi.importActual('@providers/TaskProvider');
  const mockTask = { id: 'bec70e73-2072-4f6a-bb44-b5a72fb5cddd', title: 't3' };
  const getTask = () => mockTask;

  return {
    // @ts-expect-error import typed as unknown
    TaskProvider: module.TaskProvider,
    useTasks: () => ({ getTask, allTasks: [mockTask] }),
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetModules();
});

describe('Board routes', () => {
  it('should render the Board index route when user access /board', () => {
    const router = getMemoryRouter({
      providers: [[TaskProvider]],
      options: { initialEntries: ['/board'] },
    });

    render(<App router={router} />);

    expect(screen.getByTestId('board-page')).toBeInTheDocument();
  });

  it('should render TaskPage when accessing /board/:taskId', () => {
    const router = getMemoryRouter({
      providers: [[TaskProvider]],
      options: { initialEntries: [`/board/${createUUID()}`] },
    });

    render(<App router={router} />);

    expect(screen.getByTestId('task-page')).toBeInTheDocument();
  });
});
