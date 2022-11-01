import { FC } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createBrowserRouter, createMemoryRouter, RouterProvider } from 'react-router-dom';

interface AppProps {
  router: ReturnType<typeof createBrowserRouter | typeof createMemoryRouter>;
}

const App: FC<AppProps> = ({ router }) => {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
