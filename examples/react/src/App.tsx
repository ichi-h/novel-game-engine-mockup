import { elmish } from 'elmish';
import {
  type ClearTextBoxMessage,
  generateInitModel,
  Mixer,
  type NovelMessage,
  type NovelModel,
  type ShowTextMessage,
  update,
} from 'engine';
import { type JSX, useState } from 'react';

import './index.css';
import logo from './logo.svg';
import reactLogo from './react.svg';
import bgm from './test.mp3';

const useElement = elmish<NovelModel, NovelMessage<JSX.Element>>();

const showText =
  (textBoxId: string) =>
  (content: string): ShowTextMessage => ({
    type: 'ShowText',
    textBoxId,
    content,
  });
const clear = (textBoxId: string): ClearTextBoxMessage => ({
  type: 'ClearTextBox',
  textBoxId,
});

const text = showText('textbox');

const sequence = (
  messages: NovelMessage<JSX.Element>[],
): NovelMessage<JSX.Element> => ({
  type: 'Sequence',
  messages,
});

const messages: NovelMessage<JSX.Element>[] = [
  sequence([
    { type: 'AddChannel', src: bgm, name: 'bgm', volume: 0.5 },
    { type: 'AddLayout', id: 'root' },
    { type: 'AddTextBox', id: 'textbox', layoutId: 'root' },
  ]),
  sequence([
    { type: 'PlayChannel', channelName: 'bgm' },
    text('Hello, World! - 1'),
    text('Hello, World! - 2'),
    text('Hello, World! - 3'),
  ]),
  sequence([
    clear('textbox'),
    text('Hello, World! - 4'),
    text('Hello, World! - 5'),
  ]),
  sequence([
    clear('textbox'),
    { type: 'StopChannel', channelName: 'bgm', fadeOutMs: 3000 },
    { type: 'Delay', durationMs: 3000 },
    text('The End.'),
  ]),
];

const initModel = generateInitModel(new Mixer('novel'));

export function App() {
  const [index, setIndex] = useState(0);
  const [model, setModel] = useState(initModel);
  const send = useElement(model, update, setModel);

  const next = () => {
    const msg = messages[index];
    if (!msg) return;
    console.log('msg:', msg);
    send(msg);
    setIndex(index + 1);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <div className="flex justify-center items-center gap-8 mb-8">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-24 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-[spin_20s_linear_infinite]"
        />
      </div>

      <h1 className="text-5xl font-bold my-4 leading-tight">Bun + React</h1>
      <p>
        Edit{' '}
        <code className="bg-[#1a1a1a] px-2 py-1 rounded font-mono">
          src/App.tsx
        </code>{' '}
        and save to test HMR
      </p>
      <button
        type="button"
        disabled={model.isDelaying}
        onClick={next}
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send Message
      </button>
      <blockquote className="mt-6 text-left bg-gray-800 p-4 rounded w-3xl h-96 overflow-y-scroll">
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(model.ui.widgets, null, 2)}
        </pre>
      </blockquote>
    </div>
  );
}

export default App;
