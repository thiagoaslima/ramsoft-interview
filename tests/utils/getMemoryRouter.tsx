import { createMemoryRouter, createRoutesFromElements, Outlet, Route } from 'react-router-dom';
import { AppRoutes } from '@routes/index';
import { ComposeComponents, ComposeComponentsProps } from '@components/ComposeComponents';

type GetMemoryRouterOptions = Parameters<typeof createMemoryRouter>[1];

export const getMemoryRouter = (props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers?: ComposeComponentsProps<any>['components'];
  options: GetMemoryRouterOptions;
}): ReturnType<typeof createMemoryRouter> => {
  const Providers = (
    <ComposeComponents components={props.providers ?? []}>
      <Outlet />
    </ComposeComponents>
  );

  return createMemoryRouter(
    createRoutesFromElements(
      <Route element={Providers}>
        <Route path="/*" element={<AppRoutes />} />
      </Route>,
    ),
    props.options,
  );
};
