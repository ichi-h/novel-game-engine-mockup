import {
  addLayout,
  addTextBox,
  addTrack,
  delay,
  type NovelMessage,
  playChannel,
  removeWidgets,
  sequence,
  showImage,
  showText,
  stopChannel,
} from 'engine';

import bgm from '../bgm.mp3';
import homeBg from '../home.jpg';
import logo from '../logo.svg';
import reactLogo from '../react.svg';
import shoppingMallBg from '../shopping_mall.jpg';

import {
  CHARACTER_COLORS,
  CHARACTER_LAYOUT_ID,
  changeBackground,
  clearTextBox,
  introduceCharacter,
  showCharacter,
  showCharacterDialog,
  showCharacterName,
  showDialog,
  showNarration,
  TEXTBOX_ID,
} from './helpers';

/**
 * Create the novel game scenario
 */
export const createNovelGame = (): NovelMessage[] => {
  return [
    // Scene 1: Game start
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
      playChannel('bgm'),
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
      delay(1),
      addTextBox(
        TEXTBOX_ID,
        'textbox-area',
        'w-full h-56 max-w-4xl bg-white/95 backdrop-blur-md border-4 border-pink-300 rounded-3xl p-8 shadow-2xl',
      ),
      showDialog(
        '今日は休日。妹のBunちゃんと弟のReactくんと一緒にショッピングモールへ出かけることにした。',
      ),
    ]),

    // Scene 2: Bun-chan appears
    sequence(
      introduceCharacter(
        'bun-char',
        logo,
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        'お兄ちゃん！今日は新しい服を買いに行くんだよね？わくわくしちゃう！✨',
      ),
    ),

    // Scene 3: React-kun appears
    sequence(
      introduceCharacter(
        'react-char',
        reactLogo,
        'Reactくん',
        CHARACTER_COLORS.react,
        '僕も新しいTシャツが欲しいな！早く行こうよ！',
      ),
    ),

    // Scene 4: Arrive at shopping mall
    sequence([
      clearTextBox(),
      removeWidgets(['bun-char', 'react-char']),
      changeBackground('shopping-mall-bg', shoppingMallBg),
      showDialog('ショッピングモールに到着！広くて綺麗な建物だ。'),
    ]),

    // Scene 5: Looking for clothing store
    sequence([
      clearTextBox(),
      showCharacter('bun-char', logo),
      showCharacter('react-char', reactLogo),
      showCharacterName('Bunちゃん', CHARACTER_COLORS.bun),
      showDialog('あ！あそこに可愛い服屋さんがある！行ってみよう！💕'),
    ]),

    // Scene 6: Choosing clothes
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        'わぁ！この青いTシャツかっこいい！これにしようかな！',
      ),
    ),

    // Scene 7: Bun-chan chooses clothes
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        '私はこのピンクのワンピースにする！お兄ちゃん、似合うかな？',
      ),
    ),

    // Scene 8: Player's response
    sequence(
      showCharacterDialog(
        'おまえ',
        CHARACTER_COLORS.player,
        'とても似合ってるよ！二人とも良い服を見つけられて良かったね。',
      ),
    ),

    // Scene 9: Checkout
    sequence(
      showCharacterDialog(
        'おまえ',
        CHARACTER_COLORS.player,
        'じゃあ、お会計をしようか。',
      ),
    ),

    // Scene 10: On the way home
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        '今日は楽しかった！また一緒にお買い物に来ようね、お兄ちゃん！',
      ),
    ),

    // Scene 11: React-kun's words
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        '僕も！次は靴も見たいな！',
      ),
    ),

    // Scene 12: Ending narration
    sequence(
      showNarration('楽しい一日だった。家族と過ごす時間は本当に大切だな。'),
    ),

    // Scene 13: The End
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

/**
 * Pre-generated messages for the game
 */
export const messages = createNovelGame();
