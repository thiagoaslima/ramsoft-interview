import { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OpenTaskComposer, TaskComposer } from '@components/board/column/TaskComposer';
import { TaskProvider } from '@providers/TaskProvider';
import userEvent from '@testing-library/user-event';

const customRender = () =>
  render(<TaskComposer />, {
    wrapper: ({ children }: { children?: ReactNode }) => <TaskProvider>{children}</TaskProvider>,
  });

describe('TaskComposer', () => {
  it('should render the button to open the composer', () => {
    customRender();

    const button = screen.queryByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Add task');
  });

  it('should render the composer after clicking the button', async () => {
    customRender();

    const button = screen.getByRole('button');
    const user = userEvent.setup();

    await user.click(button);

    expect(button).not.toBeInTheDocument();
    expect(screen.getByTestId('task-composer')).toBeInTheDocument();
  });
});

describe('OpenTaskComposer', () => {
  it('should render the task name input', () => {
    render(<OpenTaskComposer close={vi.fn} submit={vi.fn} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });
});
