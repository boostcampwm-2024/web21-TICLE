import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';

import App from './App';

const root = document.getElementById('root');
const isDev = import.meta.env.MODE === 'development';

if (!root) {
  throw new Error('No root element found');
}

async function enableMocking() {
  if (!isDev) {
    return;
  }

  const { worker } = await import('./__mocks__/browsers');

  // return worker.start();
}

enableMocking().then(() => {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
