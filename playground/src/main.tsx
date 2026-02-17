import React from 'react';
import { createRoot } from 'react-dom/client';

import 'prismjs/themes/prism-tomorrow.css';

import { App } from './App.js';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Missing root element');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
