import { elmish } from 'elmish';
import {
  addLayout,
  addTextBox,
  addTrack,
  clearTextBox as clearTextBoxMsg,
  generateInitModel,
  historyMiddleware,
  type NovelMessage,
  type NovelModel,
  playChannel,
  removeWidgets,
  sequence,
  showImage,
  showText,
  stopChannel,
  textAnimationMiddleware,
  update,
} from 'engine';
import { useState } from 'react';

import './index.css';
import { AudioFetcher, createApplyMixer, NovelWidgetDriver } from 'driver';
import bgm from './bgm.mp3';
import homeBg from './home.jpg';
import logo from './logo.svg';
import reactLogo from './react.svg';
import shoppingMallBg from './shopping_mall.jpg';

const useElement = elmish<NovelModel, NovelMessage>();

// メッセージ生成ヘルパー関数
const TEXTBOX_ID = 'main-textbox';
const CHARACTER_LAYOUT_ID = 'character-display';
const BG_LAYER_ID = 'background-content-layer';

const COMMON_STYLES = {
  nameText: 'font-bold text-4xl mb-4 drop-shadow-md',
  dialogText: 'text-gray-800 text-3xl leading-relaxed',
  characterImage: 'w-128 h-128 drop-shadow-2xl select-none',
} as const;

const CHARACTER_COLORS = {
  bun: 'text-pink-500',
  react: 'text-cyan-500',
  player: 'text-purple-600',
} as const;

// テキストボックスをクリア
const clearTextBox = (): NovelMessage => clearTextBoxMsg(TEXTBOX_ID);

// キャラクター名を表示
const showCharacterName = (name: string, color: string): NovelMessage =>
  showText(
    TEXTBOX_ID,
    name,
    undefined,
    `${color} ${COMMON_STYLES.nameText}`,
    100,
  );

// 台詞を表示
const showDialog = (text: string): NovelMessage =>
  showText(TEXTBOX_ID, text, undefined, COMMON_STYLES.dialogText);

// ナレーション（キャラクター名なし）
const showNarration = (text: string): NovelMessage[] => [
  clearTextBox(),
  showDialog(text),
];

// キャラクターの台詞シーン（名前 + 台詞）
const showCharacterDialog = (
  name: string,
  color: string,
  text: string,
): NovelMessage[] => [
  clearTextBox(),
  showCharacterName(name, color),
  showDialog(text),
];

// キャラクター画像を表示
const showCharacter = (id: string, src: string): NovelMessage =>
  showImage(CHARACTER_LAYOUT_ID, src, id, COMMON_STYLES.characterImage);

// キャラクター登場シーン（画像 + 名前 + 台詞）
const introduceCharacter = (
  id: string,
  src: string,
  name: string,
  color: string,
  text: string,
): NovelMessage[] => [
  clearTextBox(),
  showCharacter(id, src),
  showCharacterName(name, color),
  showDialog(text),
];

// 背景を変更
const changeBackground = (id: string, src: string): NovelMessage =>
  showImage(
    BG_LAYER_ID,
    src,
    id,
    'absolute inset-0 w-full h-full object-cover animate-fade-in',
  );

// ノベルゲームのシーン定義
const createNovelGame = (): NovelMessage[] => {
  return [
    // 初期化メッセージ（自動実行）
    sequence([
      addTrack('bgm', bgm, undefined, 1, { start: 0, end: 7650432 }),
      addLayout(
        'root',
        undefined,
        'w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center relative overflow-hidden select-none',
      ),
      addLayout(
        'background-layer',
        'root',
        'absolute inset-0 flex items-center justify-center',
      ),
      addLayout(
        'background-content-layer',
        'background-layer',
        'relative w-full h-full',
      ),
      showImage(
        'background-content-layer',
        homeBg,
        'home-bg',
        'absolute inset-0 w-full h-full object-cover',
      ),
      addLayout(
        'content-layer',
        'root',
        'absolute inset-0 flex flex-col items-center justify-between p-4 z-10',
      ),
      addLayout(
        'title-area',
        'content-layer',
        'flex-1 flex items-center justify-center',
      ),
      addTextBox(
        'title',
        'title-area',
        'text-6xl font-bold bg-[#000000bb] backdrop-blur-md rounded-3xl p-12 shadow-2xl z-50 relative',
      ),
      showText(
        'title',
        '🛍️ ショッピングモールへ行こう！ 🛍️',
        undefined,
        'drop-shadow-2xl',
        100,
      ),
    ]),

    // シーン2: タイトルフェードアウトとゲーム開始
    sequence([
      playChannel('bgm'),
      removeWidgets(['title']),
      addLayout(
        'game-container',
        'content-layer',
        'w-full h-full flex flex-col',
      ),
      addLayout(
        CHARACTER_LAYOUT_ID,
        'game-container',
        'flex-1 flex items-center justify-around px-8',
      ),
      addLayout(
        'textbox-area',
        'game-container',
        'w-full flex justify-center px-4 pb-4',
      ),
      addTextBox(
        TEXTBOX_ID,
        'textbox-area',
        'w-full h-56 max-w-4xl bg-white/95 backdrop-blur-md border-4 border-pink-300 rounded-3xl p-8 shadow-2xl',
      ),
      showDialog(
        '今日は休日。妹のBunちゃんと弟のReactくんと一緒にショッピングモールへ出かけることにした。',
      ),
    ]),

    // シーン3: Bunちゃん登場
    sequence(
      introduceCharacter(
        'bun-char',
        logo,
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        'お兄ちゃん！今日は新しい服を買いに行くんだよね？わくわくしちゃう！✨',
      ),
    ),

    // シーン4: Reactくん登場
    sequence(
      introduceCharacter(
        'react-char',
        reactLogo,
        'Reactくん',
        CHARACTER_COLORS.react,
        '僕も新しいTシャツが欲しいな！早く行こうよ！',
      ),
    ),

    // シーン5: ショッピングモール到着
    sequence([
      clearTextBox(),
      removeWidgets(['bun-char', 'react-char']),
      changeBackground('shopping-mall-bg', shoppingMallBg),
      showDialog('ショッピングモールに到着！広くて綺麗な建物だ。'),
    ]),

    // シーン6: 服屋さんを探す
    sequence([
      clearTextBox(),
      showCharacter('bun-char', logo),
      showCharacter('react-char', reactLogo),
      showCharacterName('Bunちゃん', CHARACTER_COLORS.bun),
      showDialog('あ！あそこに可愛い服屋さんがある！行ってみよう！💕'),
    ]),

    // シーン7: 服を選ぶ
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        'わぁ！この青いTシャツかっこいい！これにしようかな！',
      ),
    ),

    // シーン8: Bunちゃんも服を選ぶ
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        '私はこのピンクのワンピースにする！お兄ちゃん、似合うかな？',
      ),
    ),

    // シーン9: おまえの返事
    sequence(
      showCharacterDialog(
        'おまえ',
        CHARACTER_COLORS.player,
        'とても似合ってるよ！二人とも良い服を見つけられて良かったね。',
      ),
    ),

    // シーン10: お会計
    sequence(
      showCharacterDialog(
        'おまえ',
        CHARACTER_COLORS.player,
        'じゃあ、お会計をしようか。',
      ),
    ),

    // シーン11: 帰り道
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        '今日は楽しかった！また一緒にお買い物に来ようね、お兄ちゃん！',
      ),
    ),

    // シーン12: Reactくんの言葉
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        '僕も！次は靴も見たいな！',
      ),
    ),

    // シーン13: エンディング
    sequence(
      showNarration('楽しい一日だった。家族と過ごす時間は本当に大切だな。'),
    ),

    // シーン14: おわり
    sequence([
      stopChannel('bgm', 3000),
      removeWidgets([
        TEXTBOX_ID,
        'bun-char',
        'react-char',
        'textbox-area',
        CHARACTER_LAYOUT_ID,
        'game-container',
      ]),
      addTextBox(
        'end-title',
        'title-area',
        'text-6xl font-bold bg-[#000000bb] backdrop-blur-md rounded-3xl p-12 shadow-2xl z-50 relative',
      ),
      showText('end-title', 'おしまい', undefined, 'drop-shadow-2xl', 100),
    ]),
  ];
};

const messages = createNovelGame();
const initModel = generateInitModel();

const fetcher = new AudioFetcher();
const applyMixer = createApplyMixer(fetcher);

export function App() {
  const [model, setModel] = useState(initModel);
  const send = useElement(
    () => {
      if (model.index !== 0) return model;
      const initMessage = messages[0];
      return [model, initMessage && (async () => initMessage)];
    },
    update(applyMixer, [historyMiddleware, textAnimationMiddleware]),
    setModel,
  );

  const next = () => {
    const msg = messages[model.index];
    if (!msg) {
      console.log('ゲーム終了');
      return;
    }
    console.log(`シーン ${model.index + 1}:`, msg);
    send(msg);
  };

  console.log('model', JSON.stringify(model, null, 2));

  return (
    // biome-ignore lint/a11y/useSemanticElements: ゲーム画面全体をクリック可能にするための特殊なUI
    <div
      className="relative w-screen h-screen"
      onClick={next}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          next();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="次のシーンへ進む"
    >
      <NovelWidgetDriver widgets={model.ui} model={model} />
    </div>
  );
}

export default App;
