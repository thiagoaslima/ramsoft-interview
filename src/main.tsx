import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { getAppRouter } from '@routes/index';
import { TaskProvider } from '@providers/TaskProvider';
import App from '@components/App';

import './assets/css/reset.css';
import './assets/css/index.css';

const providers = [[TaskProvider]];

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App router={getAppRouter({ providers })} />
  </StrictMode>,
);
