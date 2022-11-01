import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getMemoryRouter } from 'tests/utils/getMemoryRouter';
import App from '@components/App';
import { TaskProvider } from '@providers/TaskProvider';

describe('App routes', () => {
  it('should render the Board index route when user access /board', () => {
    const router = getMemoryRouter({
      providers: [[TaskProvider]],
      options: { initialEntries: ['/board'] },
    });

    render(<App router={router} />);

    expect(screen.getByTestId('board-page')).toBeInTheDocument();
  });

  it('should render not found on an unknown route', () => {
    const router = getMemoryRouter({
      providers: [[TaskProvider]],
      options: { initialEntries: ['/unknown-route'] },
    });

    render(<App router={router} />);

    expect(screen.getByText('Not found')).toBeInTheDocument();
  });
});
