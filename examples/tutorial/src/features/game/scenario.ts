import type { NovelMessage } from '@ichi-h/tsuzuri-core';
import {
  addText,
  addTextBox,
  addWidgets,
  sequence,
  w,
} from '@ichi-h/tsuzuri-core';

// Initial message to setup the game
export const initMessage: NovelMessage = sequence([
  addWidgets([
    w.layout({
      id: 'root',
      className:
        'w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center relative overflow-hidden select-none',
    })([
      w.layout({
        id: 'content-layer',
        className:
          'absolute inset-0 flex flex-col items-center justify-between p-4 z-10',
      })([
        w.layout({
          id: 'textbox-area',
          className: 'w-full flex justify-center px-4 pb-4',
        })([]),
      ]),
    ]),
  ]),
]);

// Scenario messages array - will be populated with actual scenario
export const scenario: NovelMessage[] = [
  addTextBox({
    id: 'main-text',
    layoutId: 'textbox-area',
    className:
      'w-full h-56 max-w-4xl bg-white/95 backdrop-blur-md border-4 border-green-300 rounded-3xl p-8 shadow-2xl',
  }),
  addText({
    textBoxId: 'main-text',
    content: 'Tutorial game - Click to continue',
    className: 'text-gray-800 text-2xl',
  }),
];
