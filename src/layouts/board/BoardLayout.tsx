import { AppBar, Toolbar } from '@mui/material';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const BoardLayout: FC = () => {
  return (
    <>
      <AppBar data-testid="board-layout--header" position="static">
        <Toolbar>
          <h1>
            Ramsoft <i>Trello</i>
          </h1>
        </Toolbar>
      </AppBar>
      <main data-testid="board-layout--main">
        <Outlet />
      </main>
    </>
  );
};
