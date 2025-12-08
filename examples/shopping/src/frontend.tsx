/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { resumeAudioContext } from 'driver';
import { initMixerDriver } from 'libs/mixer-driver';
import { createRoot } from 'react-dom/client';
import { App } from './App';

function start() {
  initMixerDriver();

  const container = document.getElementById('app');
  if (!container) {
    throw new Error("Root element with id 'app' not found");
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
