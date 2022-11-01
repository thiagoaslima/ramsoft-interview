import { FC } from 'react';
import { createBrowserRouter, Outlet, Route, Routes, createRoutesFromElements, Navigate } from 'react-router-dom';
import { ComposeComponents, ComposeComponentsProps } from '@components/ComposeComponents';
import { NotFound } from '@components/NotFound';
import { BoardRoutes } from '@routes/board';

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="board" />} />
      <Route path="board/*" element={<BoardRoutes />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

interface GetAppRouterProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers?: ComposeComponentsProps<any>['components'];
}

export const getAppRouter = (props: GetAppRouterProps = {}): ReturnType<typeof createBrowserRouter> => {
  const { providers = [] } = props;

  const Providers = (
    <ComposeComponents components={providers}>
      <Outlet />
    </ComposeComponents>
  );

  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={Providers}>
        <Route path="/*" element={<AppRoutes />} />
      </Route>,
    ),
  );
};
