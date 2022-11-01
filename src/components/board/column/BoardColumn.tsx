import { FC } from 'react';
import styled from '@emotion/styled';

import { ColumnHeader } from './ColumnHeader';
import { TaskComposer } from './TaskComposer';
import { Task } from '@domain/entities/Task';
import { TasksList } from './TasksList';

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  background-color: #ebeced;
  border-radius: 4px;

  & > * + * {
    margin-top: 10px;
  }
`;

interface BoardColumnProps {
  name: string;
  tasks: Task[];
}

export const BoardColumn: FC<BoardColumnProps> = ({ name, tasks }) => {
  return (
    <ColumnContainer data-testid="board-column">
      <ColumnHeader>{name}</ColumnHeader>
      <TasksList tasks={tasks} />
      <TaskComposer />
    </ColumnContainer>
  );
};
