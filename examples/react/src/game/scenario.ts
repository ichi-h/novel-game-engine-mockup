import {
  addButton,
  addLayout,
  addTextBox,
  addTrack,
  awaitAction,
  delay,
  type NovelMessage,
  playChannel,
  removeWidgets,
  sequence,
  showImage,
  showText,
  stopChannel,
  switchScenario,
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
 * Scenario names
 */
export const SCENARIOS = {
  main: 'main',
  helpBun: 'help-bun',
  helpReact: 'help-react',
  ending: 'ending',
} as const;

/**
 * Type for all scenarios
 */
export type Scenarios = Record<string, NovelMessage[]>;

/**
 * Create all scenarios for the novel game
 */
export const createScenarios = (): Scenarios => {
  return {
    [SCENARIOS.main]: createMainScenario(),
    [SCENARIOS.helpBun]: createHelpBunScenario(),
    [SCENARIOS.helpReact]: createHelpReactScenario(),
    [SCENARIOS.ending]: createEndingScenario(),
  };
};

/**
 * Main scenario - Introduction and choice
 */
const createMainScenario = (): NovelMessage[] => {
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
      delay(500),
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

    // Scene 5: Both characters appear and need help
    sequence([
      clearTextBox(),
      showCharacter('bun-char', logo),
      showCharacter('react-char', reactLogo),
      showCharacterName('Bunちゃん', CHARACTER_COLORS.bun),
      showDialog('あ！あそこに可愛い服屋さんがある！行ってみたい！💕'),
    ]),

    // Scene 6: React-kun wants to go elsewhere
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        'えー、僕はあっちのゲームショップに行きたいんだけど...',
      ),
    ),

    // Scene 7: Player must choose
    sequence([
      clearTextBox(),
      showCharacterName('おまえ', CHARACTER_COLORS.player),
      showDialog('どっちに付き合おうかな...'),
    ]),

    // Scene 8: Choice - Show buttons and await action
    sequence([
      clearTextBox(),
      showDialog('誰と一緒に行く？'),
      addLayout(
        'choice-buttons',
        'textbox-area',
        'flex gap-4 mt-4 justify-center',
      ),
      addButton(
        'Bunちゃんと服を見に行く 👗',
        switchScenario(SCENARIOS.helpBun),
        'choice-buttons',
        'btn-bun',
        'px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xl font-bold transition-colors shadow-lg',
      ),
      addButton(
        'Reactくんとゲームショップへ 🎮',
        switchScenario(SCENARIOS.helpReact),
        'choice-buttons',
        'btn-react',
        'px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-xl font-bold transition-colors shadow-lg',
      ),
      awaitAction(),
    ]),
  ];
};

/**
 * Help Bun-chan scenario - Go to clothing store
 */
const createHelpBunScenario = (): NovelMessage[] => {
  return [
    // Clean up choice buttons
    sequence([
      removeWidgets(['choice-buttons']),
      clearTextBox(),
      showCharacterName('おまえ', CHARACTER_COLORS.player),
      showDialog('Bunちゃん、一緒に服を見に行こうか。'),
    ]),

    // Bun-chan is happy
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        'やったー！お兄ちゃん大好き！💕',
      ),
    ),

    // React-kun understands
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        'いいよ、僕は後で見に行くね。',
      ),
    ),

    // At the clothing store
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        'わぁ！このピンクのワンピース可愛い！お兄ちゃん、似合うかな？',
      ),
    ),

    // Player responds
    sequence(
      showCharacterDialog(
        'おまえ',
        CHARACTER_COLORS.player,
        'とても似合ってるよ！可愛いね。',
      ),
    ),

    // Bun-chan is very happy
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        'えへへ、ありがとう！これ買ってもらおうっと！✨',
      ),
    ),

    // Switch to ending
    sequence([switchScenario(SCENARIOS.ending)]),
  ];
};

/**
 * Help React-kun scenario - Go to game shop
 */
const createHelpReactScenario = (): NovelMessage[] => {
  return [
    // Clean up choice buttons
    sequence([
      removeWidgets(['choice-buttons']),
      clearTextBox(),
      showCharacterName('おまえ', CHARACTER_COLORS.player),
      showDialog('Reactくん、ゲームショップに行こうか。'),
    ]),

    // React-kun is happy
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        'やった！兄ちゃん最高！🎮',
      ),
    ),

    // Bun-chan understands
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        'うん、私は先に服を見てくるね〜',
      ),
    ),

    // At the game shop
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        'うわぁ！新作のRPGが出てる！これ、面白そうだなぁ！',
      ),
    ),

    // Player responds
    sequence(
      showCharacterDialog(
        'おまえ',
        CHARACTER_COLORS.player,
        'へぇ、確かに面白そうだね。買って一緒に遊ぼうか。',
      ),
    ),

    // React-kun is very happy
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        '本当!? ありがとう兄ちゃん！早く帰って遊びたい！',
      ),
    ),

    // Switch to ending
    sequence([switchScenario(SCENARIOS.ending)]),
  ];
};

/**
 * Common ending scenario
 */
const createEndingScenario = (): NovelMessage[] => {
  return [
    // Everyone gathers
    sequence([
      clearTextBox(),
      showDialog('買い物を終えて、みんなで合流した。'),
    ]),

    // On the way home
    sequence(
      showCharacterDialog(
        'Bunちゃん',
        CHARACTER_COLORS.bun,
        '今日は楽しかった！また一緒にお買い物に来ようね、お兄ちゃん！',
      ),
    ),

    // React-kun agrees
    sequence(
      showCharacterDialog(
        'Reactくん',
        CHARACTER_COLORS.react,
        '僕も！次は靴も見たいな！',
      ),
    ),

    // Ending narration
    sequence(
      showNarration('楽しい一日だった。家族と過ごす時間は本当に大切だな。'),
    ),

    // The End
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
 * Pre-generated scenarios for the game
 */
export const scenarios = createScenarios();
