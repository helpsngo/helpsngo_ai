import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { I18nProvider } from './i18n/I18nContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { registerFieldServiceWorker } from './services/offlineSyncService.ts';
import './index.css';

// Register PWA Service Worker for remote village offline task caching
registerFieldServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
);

