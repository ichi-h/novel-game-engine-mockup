import { elmish } from 'elmish';
import {
  generateInitModel,
  Mixer,
  type NovelMessage,
  type NovelModel,
  update,
} from 'engine';
import { useState } from 'react';

import './index.css';
import { NovelWidgetDriver, type ReactComponentDriver } from 'driver';
import bgm from './bgm.mp3';
import logo from './logo.svg';
import reactLogo from './react.svg';
import shoppingMallBg from './shopping_mall.jpg';

const useElement = elmish<
  NovelModel<ReactComponentDriver>,
  NovelMessage<ReactComponentDriver>
>();

const sequence = (
  messages: NovelMessage<ReactComponentDriver>[],
): NovelMessage<ReactComponentDriver> => ({
  type: 'Sequence',
  messages,
});

// ノベルゲームのシーン定義
const createNovelGame = (): NovelMessage<ReactComponentDriver>[] => {
  return [
    // シーン2: タイトルフェードアウトとゲーム開始
    sequence([
      { type: 'PlayChannel', channelName: 'bgm' },
      { type: 'RemoveWidgets', ids: ['title'] },
      {
        type: 'AddLayout',
        id: 'game-container',
        parentLayoutId: 'content-layer',
        style: 'w-full h-full flex flex-col',
      },
      {
        type: 'AddLayout',
        id: 'character-display',
        parentLayoutId: 'game-container',
        style: 'flex-1 flex items-center justify-around px-8',
      },
      {
        type: 'AddLayout',
        id: 'textbox-area',
        parentLayoutId: 'game-container',
        style: 'w-full flex justify-center px-4 pb-4',
      },
      {
        type: 'AddTextBox',
        id: 'main-textbox',
        layoutId: 'textbox-area',
        style:
          'w-full h-56 max-w-4xl bg-white/95 backdrop-blur-md border-4 border-pink-300 rounded-3xl p-8 shadow-2xl',
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '主人公',
        style: 'text-purple-600 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content:
          '今日は休日。妹のBunちゃんと弟のReactくんと一緒にショッピングモールへ出かけることにした。',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン3: Bunちゃん登場
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowImage',
        id: 'bun-char',
        layoutId: 'character-display',
        src: logo,
        style: 'w-96 h-96 drop-shadow-2xl select-none',
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'Bunちゃん',
        style: 'text-pink-500 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content:
          'お兄ちゃん！今日は新しい服を買いに行くんだよね？わくわくしちゃう！✨',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン4: Reactくん登場
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowImage',
        id: 'react-char',
        layoutId: 'character-display',
        src: reactLogo,
        style: 'w-96 h-96 drop-shadow-2xl select-none',
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'Reactくん',
        style: 'text-cyan-500 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '僕も新しいTシャツが欲しいな！早く行こうよ！',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン5: ショッピングモール到着
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      { type: 'RemoveWidgets', ids: ['bun-char', 'react-char'] },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '主人公',
        style: 'text-purple-600 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'ショッピングモールに到着！広くて綺麗な建物だ。',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン6: 服屋さんを探す
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowImage',
        id: 'bun-char',
        layoutId: 'character-display',
        src: logo,
        style: 'w-96 h-96 drop-shadow-2xl select-none',
      },
      {
        type: 'ShowImage',
        id: 'react-char',
        layoutId: 'character-display',
        src: reactLogo,
        style: 'w-96 h-96 drop-shadow-2xl select-none',
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'Bunちゃん',
        style: 'text-pink-500 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'あ！あそこに可愛い服屋さんがある！行ってみよう！💕',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン7: 服を選ぶ
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'Reactくん',
        style: 'text-cyan-500 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'わぁ！この青いTシャツかっこいい！これにしようかな！',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン8: Bunちゃんも服を選ぶ
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'Bunちゃん',
        style: 'text-pink-500 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '私はこのピンクのワンピースにする！お兄ちゃん、似合うかな？',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン9: 主人公の返事
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '主人公',
        style: 'text-purple-600 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'とても似合ってるよ！二人とも良い服を見つけられて良かったね。',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン10: お会計
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '主人公',
        style: 'text-purple-600 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'じゃあ、お会計をしようか。',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン11: 帰り道
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'Bunちゃん',
        style: 'text-pink-500 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '今日は楽しかった！また一緒にお買い物に来ようね、お兄ちゃん！',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン12: Reactくんの言葉
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: 'Reactくん',
        style: 'text-cyan-500 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '僕も！次は靴も見たいな！',
        style: 'text-gray-800 text-3xl leading-relaxed',
        speed: 50,
      },
    ]),

    // シーン13: エンディング
    sequence([
      { type: 'ClearTextBox', textBoxId: 'main-textbox' },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '主人公',
        style: 'text-purple-600 font-bold text-4xl mb-4 drop-shadow-md',
        speed: 50,
      },
      {
        type: 'ShowText',
        textBoxId: 'main-textbox',
        content: '楽しい一日だった。家族と過ごす時間は本当に大切だな。',
        style: 'text-gray-800 text-3xl leading-relaxed italic',
        speed: 50,
      },
    ]),

    // シーン14: タイトル画面に戻る
    sequence([
      { type: 'StopChannel', channelName: 'bgm', fadeOutMs: 3000 },
      {
        type: 'RemoveWidgets',
        ids: [
          'main-textbox',
          'bun-char',
          'react-char',
          'textbox-area',
          'character-display',
          'game-container',
        ],
      },
      {
        type: 'AddTextBox',
        id: 'end-title',
        layoutId: 'title-area',
        style:
          'text-6xl font-bold bg-[#000000bb] backdrop-blur-md rounded-3xl p-12 shadow-2xl z-50 relative',
      },
      {
        type: 'ShowText',
        textBoxId: 'end-title',
        content: '✨ おしまい ✨',
        style: 'drop-shadow-2xl',
        speed: 100,
      },
    ]),
  ];
};

// 初期化メッセージ（自動実行）
const initMessage: NovelMessage<ReactComponentDriver> = sequence([
  {
    type: 'AddChannel',
    src: bgm,
    name: 'bgm',
    volume: 0.3,
    loop: { start: 0, end: 7650432 },
  },
  {
    type: 'AddLayout',
    id: 'root',
    style:
      'w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center relative overflow-hidden',
  },
  {
    type: 'AddLayout',
    id: 'background-layer',
    parentLayoutId: 'root',
    style: 'absolute inset-0 flex items-center justify-center',
  },
  {
    type: 'ShowImage',
    id: 'shopping-mall-bg',
    layoutId: 'background-layer',
    src: shoppingMallBg,
    style: 'w-full h-full object-cover',
  },
  {
    type: 'AddLayout',
    id: 'content-layer',
    parentLayoutId: 'root',
    style:
      'absolute inset-0 flex flex-col items-center justify-between p-4 z-10',
  },
  {
    type: 'AddLayout',
    id: 'title-area',
    parentLayoutId: 'content-layer',
    style: 'flex-1 flex items-center justify-center',
  },
  {
    type: 'AddTextBox',
    id: 'title',
    layoutId: 'title-area',
    style:
      'text-6xl font-bold bg-[#000000bb] backdrop-blur-md rounded-3xl p-12 shadow-2xl z-50 relative',
  },
  {
    type: 'ShowText',
    textBoxId: 'title',
    content: '🛍️ ショッピングモールへ行こう！ 🛍️',
    style: 'drop-shadow-2xl',
    speed: 80,
  },
]);

const messages = createNovelGame();
const initModel = generateInitModel<ReactComponentDriver>(new Mixer('novel'));

export function App() {
  const [index, setIndex] = useState(0);
  const [model, setModel] = useState(initModel);
  const send = useElement(
    () => {
      return [
        model,
        async () => {
          return initMessage;
        },
      ];
    },
    update,
    setModel,
  );

  const next = () => {
    const msg = messages[index];
    if (!msg) {
      console.log('ゲーム終了');
      return;
    }
    console.log(`シーン ${index + 1}:`, msg);
    send(msg);
    setIndex(index + 1);
  };

  // 画面クリックで進む
  const handleScreenClick = () => {
    if (index < messages.length) {
      next();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: ゲーム画面全体をクリック可能にするための特殊なUI
    <div
      className="relative w-screen h-screen"
      onClick={handleScreenClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleScreenClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="次のシーンへ進む"
    >
      <NovelWidgetDriver widgets={model.ui.widgets} />
    </div>
  );
}

export default App;
