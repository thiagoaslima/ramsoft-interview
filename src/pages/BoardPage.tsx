import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useTasks } from '@providers/TaskProvider';
import { TasksBoard } from '@components/board/TasksBoard';

export const BoardPage: FC = () => {
  const { allTasks } = useTasks();

  return (
    <section data-testid="board-page">
      <TasksBoard tasks={allTasks} />
      <Outlet />
    </section>
  );
};
