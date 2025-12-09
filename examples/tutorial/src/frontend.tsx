/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { resumeAudioContext } from '@ichi-h/tsuzuri-driver';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initMixerDriver } from './libs/mixer-driver';

function start() {
  initMixerDriver();

  const container = document.getElementById('react-app-root');
  if (!container) {
    throw new Error("Root element with id 'react-app-root' not found");
  }
  const root = createRoot(container);
  root.render(<App />);

  document.addEventListener('click', async () => {
    await resumeAudioContext();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
