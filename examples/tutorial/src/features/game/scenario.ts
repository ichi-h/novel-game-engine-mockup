import type { NovelMessage } from '@ichi-h/tsuzuri-core';
import {
  addBusTrack,
  addWidgets,
  changeChannelVolume,
  delay,
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
  applyAnimation,
  BACKGROUNDS,
  CHARACTER_IMAGES,
  changeBackground,
  hideCenteredImage,
  hideSpeechBubble,
  IMAGES,
  playBGM,
  playCharacterVoice,
  removeCharacter,
  showCenteredImage,
  showCharacter,
  showSpeechBubble,
  VOICE_CHANNEL_IDS,
  // stopSE,
} from './helpers';
import { playSE } from './se';

// ============================================================================
// Chapter 1: Intro (イントロ)
// ============================================================================

const chapter1Intro: NovelMessage[] = [
  sequence([
    changeBackground('bg-room', BACKGROUNDS.room),
    delay(1000),
    playBGM('bgm-tyrannosaurus', BGM.TYRANNOSAURUS_NEEDLE_ROOD, true),
    playSE(SE.EXPLOSION),
    // playSE('se-sword-swing', SE.SWORD_SWING, true), // Loop
    showCharacter('zundamon', CHARACTER_IMAGES.zundamon.default, 'right'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V001),
    showSpeechBubble('zundamon', 'うおーーーーーー！！！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V002),
    showSpeechBubble('zundamon', 'ノベルゲームが、作りたいのだ！！！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    showCharacter('metan', CHARACTER_IMAGES.metan.default, 'left'),
    playCharacterVoice('metan', VOICE_METAN.V001),
    showSpeechBubble(
      'metan',
      'はぁ……いつにもましてうるさいですね。今日はどうしたんですか？',
    ),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    // stopSE('se-sword-swing'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V003),
    showSpeechBubble('zundamon', 'めたん、聞いてほしいのだ！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V004),
    showSpeechBubble('zundamon', 'ノベルゲームが作りたいのだ！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V002),
    showSpeechBubble(
      'metan',
      'ノベルゲーム？　なんでまたノベルゲームなの？　ゲームならRPGとかアクションとか、ほかにも色々あるでしょ。',
    ),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V005),
    showSpeechBubble('zundamon', 'よくぞ聞いてくれのだ！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeChannelVolume({
      channelId: 'bgm-tyrannosaurus',
      volume: 0,
    }),
    playBGM('bgm-heishi', BGM.HEISHI),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V006),
    showSpeechBubble('zundamon', 'めたん。ノベルゲームとは、芸術なのだ。'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V003),
    showSpeechBubble('metan', 'なんか始まったぞおい。'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V007),
    showSpeechBubble(
      'zundamon',
      'これは単なるゲームではない。言葉と、音と、イラストが紡ぎだす総合芸術なのだ。',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    showCenteredImage('img-sakutaro', IMAGES.sakutaro),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V008),
    showSpeechBubble(
      'zundamon',
      'かの萩原朔太郎も、人の感情を完全に表現しようと思ったら、そこには音楽と詩があるばかりと言ったのだ。',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    hideCenteredImage('img-sakutaro'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V009),
    showSpeechBubble(
      'zundamon',
      'そう、何かを表現しようと思ったら、そこには言葉を超えた言葉と、音を超えた音が必要なのだ。',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V010),
    showSpeechBubble(
      'zundamon',
      'でもノベルゲームはそれだけではない！　なんとイラストも使えてしまうのだ！',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V011),
    showSpeechBubble(
      'zundamon',
      'これだけ表現の幅があるなら、きっとすごいものが作れるに違いないのだ！',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    removeChannel('bgm-heishi'),
    changeChannelVolume({
      channelId: 'bgm-tyrannosaurus',
      volume: 1.0,
    }),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V012),
    showSpeechBubble('zundamon', 'なぁめたんもそう思うのだ？'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V004),
    showSpeechBubble(
      'metan',
      'まぁおおむね同意するけど……じゃあずんだもんは小説とか書いたことあるの？',
    ),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playSE(SE.TAIKO_DON),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V013),
    showSpeechBubble('zundamon', 'ない！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V005),
    showSpeechBubble('metan', '音楽は？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playSE(SE.TAIKO_DON),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V014),
    showSpeechBubble('zundamon', 'ない！！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V006),
    showSpeechBubble('metan', 'イラストは？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playSE(SE.TAIKO_DON2),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V015),
    showSpeechBubble('zundamon', 'ないのだ！！！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V007),
    showSpeechBubble('metan', 'プログラミングは？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playSE(SE.SOLEMN_ATMOSPHERE),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V016),
    showSpeechBubble('zundamon', 'それはできるのだ！！！！！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V008),
    showSpeechBubble('metan', 'はぁ。左様ですか……。'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V017),
    showSpeechBubble(
      'zundamon',
      'というわけでめたん、次合うまでに神ゲーを作ってくるから、それまで首洗って待っておくのだ！',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playSE(SE.PYUN_ESCAPE),
    applyAnimation('zundamon', 'goodbye-right'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V018),
    showSpeechBubble('zundamon', 'じゃあな！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    removeChannel('bgm-tyrannosaurus'),
    playCharacterVoice('metan', VOICE_METAN.V009),
    showSpeechBubble(
      'metan',
      'あぁ行っちゃった……まぁきっと途中で飽きちゃうでしょうねぇ……。',
    ),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    removeCharacter('metan'),
    removeCharacter('zundamon'),
    removeChannel(VOICE_CHANNEL_IDS.metan),
    // TODO: Add fade out animation
    playSE(SE.CHICKEN_CRY),
    // TODO: Add text display for narration "2週間後……"
  ]),

  sequence([
    showCharacter('metan', CHARACTER_IMAGES.metan.default, 'left'),
    showCharacter('zundamon', CHARACTER_IMAGES.zundamon.sunglasses, 'right'),
    // TODO: Add fade in animation
    playBGM('bgm-march', BGM.MARCH),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V019),
    showSpeechBubble('zundamon', 'やぁめたん。'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V010),
    showSpeechBubble(
      'metan',
      'あら久しぶりねずんだもん。って何そのサングラス。',
    ),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V020),
    showSpeechBubble('zundamon', 'できたのだ。'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V011),
    showSpeechBubble('metan', '何が？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playSE(SE.SPREAD_PAPER),
    showCenteredImage('img-src', IMAGES.src),
  ]),

  sequence([
    playCharacterVoice('metan', VOICE_METAN.V012),
    showSpeechBubble('metan', 'えなにこれ。'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V021),
    showSpeechBubble('zundamon', 'ソースコードなのだ。'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V013),
    showSpeechBubble('metan', 'いやわかるけど。なんの？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V022),
    showSpeechBubble('zundamon', 'ゲーム『エンジン』の、ソースコードなのだ。'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V014),
    showSpeechBubble('metan', '……はい？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    removeChannel('bgm-march'),
    // TODO: Add screen blackout animation
    playSE(SE.MAN_YAHOO),
    // TODO: Add title text "関数型ノベルゲームエンジン "tsuzuri" 解説"
  ]),

  // TODO: Add fade out animation and transition to next chapter
];

// Scenario messages array - will be populated with actual scenario
export const scenario: NovelMessage[] = [...chapter1Intro];
