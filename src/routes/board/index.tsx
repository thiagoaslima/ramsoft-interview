import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BoardLayout } from '@layouts/board/BoardLayout';
import { BoardPage } from '@pages/BoardPage';
import { TaskPage } from '@pages/TaskPage';

export const BoardRoutes: FC = () => {
  return (
    <Routes>
      <Route element={<BoardLayout />}>
        <Route path="" element={<BoardPage />}>
          <Route path="/:taskId" element={<TaskPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
