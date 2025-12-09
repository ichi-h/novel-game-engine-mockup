import type { NovelMessage } from '@ichi-h/tsuzuri-core';
import {
  addBusTrack,
  addWidgets,
  changeChannelVolume,
  removeChannel,
  sequence,
  w,
} from '@ichi-h/tsuzuri-core';
import { AUDIO_BUS_IDS } from '../../constants/audio';
import { loadConfig } from '../config/loadConfig';

const config = loadConfig();

// Initial message to setup the game
export const initMessage: NovelMessage = sequence([
  // Create audio bus tracks for BGM, SE, and Voice
  addBusTrack({ id: AUDIO_BUS_IDS.BGM, volume: config.bgmVolume }),
  addBusTrack({ id: AUDIO_BUS_IDS.SE, volume: config.seVolume }),
  addBusTrack({ id: AUDIO_BUS_IDS.VOICE, volume: config.voiceVolume }),

  // Setup UI
  addWidgets([
    w.layout({
      id: 'root',
      className:
        'w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center relative overflow-hidden select-none',
    })([
      // Background layer
      w.layout({
        id: 'background-layer',
        className: 'absolute inset-0 z-0',
      })([]),

      // Character display layer
      w.layout({
        id: 'character-display',
        className: 'absolute inset-0 z-10',
      })([]),

      // Speech bubble layer
      w.layout({
        id: 'speech-bubble-layout',
        className: 'absolute inset-0 z-20 pointer-events-none',
      })([]),

      // Image display layer (for centered images)
      w.layout({
        id: 'image-display',
        className:
          'absolute inset-0 z-15 flex items-center justify-center pointer-events-none',
      })([]),

      // Content layer for textbox mode
      w.layout({
        id: 'content-layer',
        className:
          'absolute inset-0 flex flex-col items-center justify-between p-4 z-30',
      })([
        w.layout({
          id: 'textbox-area',
          className: 'w-full flex justify-center px-4 pb-4',
        })([]),
      ]),
    ]),
  ]),
]);

import { BGM, SE, VOICE_METAN, VOICE_ZUNDAMON } from '../../constants/audio';
// Import helpers and constants
import {
  BACKGROUNDS,
  CHARACTER_IMAGES,
  changeBackground,
  hideCenteredImage,
  hideCharacter,
  hideSpeechBubble,
  IMAGES,
  playBGM,
  playCharacterVoice,
  playSE,
  showCenteredImage,
  showCharacter,
  showSpeechBubble,
  stopBGM,
  stopSE,
} from './helpers';

// ============================================================================
// Chapter 1: Intro (イントロ)
// ============================================================================

const chapter1Intro: NovelMessage[] = [
  // [Click 0] Setup: background, BGM, SE, show Zundamon
  sequence([
    changeBackground('bg-room', BACKGROUNDS.room),
    playBGM('bgm-tyrannosaurus', BGM.TYRANNOSAURUS_NEEDLE_ROOD, true),
    playSE('se-explosion', SE.EXPLOSION),
    playSE('se-sword-swing', SE.SWORD_SWING, true), // Loop
    showCharacter('zundamon', CHARACTER_IMAGES.zundamon.default, 'right'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V001),
    showSpeechBubble('zundamon', 'うおーーーーーー！！！', 'right'),
  ]),

  // [Click 1] Zundamon's second line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V002),
    showSpeechBubble('zundamon', 'ノベルゲームが、作りたいのだ！！！', 'right'),
  ]),

  // [Click 2] Show Metan and her first line
  sequence([
    hideSpeechBubble('zundamon'),
    showCharacter('metan', CHARACTER_IMAGES.metan.default, 'left'),
    playCharacterVoice('metan', VOICE_METAN.V001),
    showSpeechBubble(
      'metan',
      'はぁ……いつにもましてうるさいですね。今日はどうしたんですか？',
      'left',
    ),
  ]),

  // [Click 3] Stop SE and Zundamon's third line
  sequence([
    hideSpeechBubble('metan'),
    stopSE('se-sword-swing'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V003),
    showSpeechBubble('zundamon', 'めたん、聞いてほしいのだ！', 'right'),
  ]),

  // [Click 4] Zundamon's fourth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V004),
    showSpeechBubble('zundamon', 'ノベルゲームが作りたいのだ！', 'right'),
  ]),

  // [Click 5] Metan's second line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V002),
    showSpeechBubble(
      'metan',
      'ノベルゲーム？　なんでまたノベルゲームなの？　ゲームならRPGとかアクションとか、ほかにも色々あるでしょ。',
      'left',
    ),
  ]),

  // [Click 6] Zundamon's fifth line
  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V005),
    showSpeechBubble('zundamon', 'よくぞ聞いてくれのだ！', 'right'),
  ]),

  // [Click 7] Stop/change BGM and Zundamon's sixth line
  sequence([
    hideSpeechBubble('zundamon'),
    changeChannelVolume({
      channelId: 'bgm-tyrannosaurus',
      volume: 0,
    }),
    playBGM('bgm-heishi', BGM.HEISHI),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V006),
    showSpeechBubble(
      'zundamon',
      'めたん。ノベルゲームとは、芸術なのだ。',
      'right',
    ),
  ]),

  // [Click 8] Metan's third line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V003),
    showSpeechBubble('metan', 'なんか始まったぞおい。', 'left'),
  ]),

  // [Click 9] Zundamon's seventh line
  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V007),
    showSpeechBubble(
      'zundamon',
      'これは単なるゲームではない。言葉と、音と、イラストが紡ぎだす総合芸術なのだ。',
      'right',
    ),
  ]),

  // [Click 10] Show Sakutaro image and Zundamon's eighth line
  sequence([
    hideSpeechBubble('zundamon'),
    showCenteredImage('img-sakutaro', IMAGES.sakutaro),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V008),
    showSpeechBubble(
      'zundamon',
      'かの萩原朔太郎も、人の感情を完全に表現しようと思ったら、そこには音楽と詩があるばかりと言ったのだ。',
      'right',
    ),
  ]),

  // [Click 11] Hide Sakutaro and Zundamon's ninth line
  sequence([
    hideSpeechBubble('zundamon'),
    hideCenteredImage('img-sakutaro'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V009),
    showSpeechBubble(
      'zundamon',
      'そう、何かを表現しようと思ったら、そこには言葉を超えた言葉と、音を超えた音が必要なのだ。',
      'right',
    ),
  ]),

  // [Click 12] Zundamon's tenth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V010),
    showSpeechBubble(
      'zundamon',
      'でもノベルゲームはそれだけではない！　なんとイラストも使えてしまうのだ！',
      'right',
    ),
  ]),

  // [Click 13] Zundamon's eleventh line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V011),
    showSpeechBubble(
      'zundamon',
      'これだけ表現の幅があるなら、きっとすごいものが作れるに違いないのだ！',
      'right',
    ),
  ]),

  // [Click 14] Stop/resume BGM and Zundamon's twelfth line
  sequence([
    hideSpeechBubble('zundamon'),
    stopBGM('bgm-heishi'),
    changeChannelVolume({
      channelId: 'bgm-tyrannosaurus',
      volume: 1.0,
    }),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V012),
    showSpeechBubble('zundamon', 'なぁめたんもそう思うのだ？', 'right'),
  ]),

  // [Click 15] Metan's fourth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V004),
    showSpeechBubble(
      'metan',
      'まぁおおむね同意するけど……じゃあずんだもんは小説とか書いたことあるの？',
      'left',
    ),
  ]),

  // [Click 16] SE and Zundamon's thirteenth line
  sequence([
    hideSpeechBubble('metan'),
    playSE('se-taiko-don', SE.TAIKO_DON),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V013),
    showSpeechBubble('zundamon', 'ない！', 'right'),
  ]),

  // [Click 17] Metan's fifth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V005),
    showSpeechBubble('metan', '音楽は？', 'left'),
  ]),

  // [Click 18] SE and Zundamon's fourteenth line
  sequence([
    hideSpeechBubble('metan'),
    removeChannel('se-taiko-don'),
    playSE('se-taiko-don', SE.TAIKO_DON),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V014),
    showSpeechBubble('zundamon', 'ない！！', 'right'),
  ]),

  // [Click 19] Metan's sixth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V006),
    showSpeechBubble('metan', 'イラストは？', 'left'),
  ]),

  // [Click 20] SE and Zundamon's fifteenth line
  sequence([
    hideSpeechBubble('metan'),
    playSE('se-taiko-don2', SE.TAIKO_DON2),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V015),
    showSpeechBubble('zundamon', 'ないのだ！！！', 'right'),
  ]),

  // [Click 21] Metan's seventh line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V007),
    showSpeechBubble('metan', 'プログラミングは？', 'left'),
  ]),

  // [Click 22] SE and Zundamon's sixteenth line
  sequence([
    hideSpeechBubble('metan'),
    playSE('se-solemn', SE.SOLEMN_ATMOSPHERE),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V016),
    showSpeechBubble('zundamon', 'それはできるのだ！！！！！', 'right'),
  ]),

  // [Click 23] Metan's eighth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V008),
    showSpeechBubble('metan', 'はぁ。左様ですか……。', 'left'),
  ]),

  // [Click 24] Zundamon's seventeenth line
  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V017),
    showSpeechBubble(
      'zundamon',
      'というわけでめたん、次合うまでに神ゲーを作ってくるから、それまで首洗って待っておくのだ！',
      'right',
    ),
  ]),

  // [Click 25] SE, hide Zundamon, and his eighteenth line (off-screen)
  sequence([
    hideSpeechBubble('zundamon'),
    playSE('se-pyun-escape', SE.PYUN_ESCAPE),
    hideCharacter('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V018),
    showSpeechBubble('zundamon', 'じゃあな！', 'right'),
  ]),

  // [Click 26] Stop BGM and Metan's ninth line
  sequence([
    hideSpeechBubble('zundamon'),
    stopBGM('bgm-tyrannosaurus'),
    playCharacterVoice('metan', VOICE_METAN.V009),
    showSpeechBubble(
      'metan',
      'あぁ行っちゃった……まぁきっと途中で飽きちゃうでしょうねぇ……。',
      'left',
    ),
  ]),

  // [Click 27] Time skip: SE chicken and show Zundamon with sunglasses
  sequence([
    hideSpeechBubble('metan'),
    // TODO: Add fade out animation
    playSE('se-chicken', SE.CHICKEN_CRY),
    // TODO: Add text display for narration "2週間後……"
    showCharacter('zundamon', CHARACTER_IMAGES.zundamon.sunglasses, 'right'),
    // TODO: Add fade in animation
    playBGM('bgm-march', BGM.MARCH),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V019),
    showSpeechBubble('zundamon', 'やぁめたん。', 'right'),
  ]),

  // [Click 28] Metan's tenth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V010),
    showSpeechBubble(
      'metan',
      'あら久しぶりねずんだもん。って何そのサングラス。',
      'left',
    ),
  ]),

  // [Click 29] Zundamon's twentieth line
  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V020),
    showSpeechBubble('zundamon', 'できたのだ。', 'right'),
  ]),

  // [Click 30] Metan's eleventh line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V011),
    showSpeechBubble('metan', '何が？', 'left'),
  ]),

  // [Click 31] SE, show source code image, and Metan's twelfth line
  sequence([
    hideSpeechBubble('metan'),
    playSE('se-spread-paper', SE.SPREAD_PAPER),
    showCenteredImage('img-src', IMAGES.src),
    playCharacterVoice('metan', VOICE_METAN.V012),
    showSpeechBubble('metan', 'えなにこれ。', 'left'),
  ]),

  // [Click 32] Zundamon's twenty-first line
  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V021),
    showSpeechBubble('zundamon', 'ソースコードなのだ。', 'right'),
  ]),

  // [Click 33] Metan's thirteenth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V013),
    showSpeechBubble('metan', 'いやわかるけど。なんの？', 'left'),
  ]),

  // [Click 34] Zundamon's twenty-second line
  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V022),
    showSpeechBubble(
      'zundamon',
      'ゲーム『エンジン』の、ソースコードなのだ。',
      'right',
    ),
  ]),

  // [Click 35] Metan's fourteenth line
  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V014),
    showSpeechBubble('metan', '……はい？', 'left'),
  ]),

  // [Click 36] Stop BGM, SE Man Yahoo, and title display
  sequence([
    hideSpeechBubble('metan'),
    stopBGM('bgm-march'),
    // TODO: Add screen blackout animation
    playSE('se-man-yahoo', SE.MAN_YAHOO),
    // TODO: Add title text "関数型ノベルゲームエンジン "tsuzuri" 解説"
  ]),

  // TODO: Add fade out animation and transition to next chapter
];

// Scenario messages array - will be populated with actual scenario
export const scenario: NovelMessage[] = [...chapter1Intro];
