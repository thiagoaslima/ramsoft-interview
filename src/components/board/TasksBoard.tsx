import { FC } from 'react';
import styled from '@emotion/styled';
import { Task } from '@domain/entities/Task';
import { BoardColumn } from './column/BoardColumn';
import { useTasks } from '@providers/TaskProvider';

interface TasksBoardProps {
  tasks: Task[];
}

const Board = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  padding: 30px;
`;

export const TasksBoard: FC<TasksBoardProps> = () => {
  const { allTasks } = useTasks();

  return (
    <Board>
      <BoardColumn name="To Do" tasks={allTasks} />
    </Board>
  );
};
