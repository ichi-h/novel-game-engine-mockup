import type { NovelMessage } from '@ichi-h/tsuzuri-core';
import {
  addBusTrack,
  addWidgets,
  changeChannelVolume,
  delay,
  removeChannel,
  removeWidgets,
  sequence,
  updateWidgetProps,
  w,
} from '@ichi-h/tsuzuri-core';
import {
  AUDIO_BUS_IDS,
  BGM,
  SE,
  VOICE_METAN,
  VOICE_ZUNDAMON,
} from '../../constants/audio';
import { loadConfig } from '../config/loadConfig';
import {
  applyAnimation,
  BACKGROUNDS,
  BG_LAYER_ID,
  CHARACTER_COLORS,
  CHARACTER_IMAGES,
  CHARACTER_LAYOUT_ID,
  changeBackground,
  changeCharacterExpression,
  clearTextBox,
  FADE_OVERLAY_ID,
  fadeIn,
  fadeOut,
  hideCenteredImage,
  hideNarrationText,
  hideSpeechBubble,
  IMAGE_DISPLAY_ID,
  IMAGES,
  initTextBoxLayout,
  NARRATION_LAYER_ID,
  playBGM,
  playCharacterVoice,
  removeCharacter,
  SPEECH_BUBBLE_LAYOUT_ID,
  showCenteredImage,
  showCharacter,
  showCharacterDialog,
  showExplanatoryImage,
  showNarrationText,
  showSpeechBubble,
  TEXTBOX_ID,
  VOICE_CHANNEL_IDS,
  // stopSE,
} from './helpers';
import { playSE } from './se';

const config = loadConfig();

// Initial message to setup the game
export const initMessage: NovelMessage = sequence([
  // Create audio bus tracks for BGM, SE, and Voice
  addBusTrack({ id: AUDIO_BUS_IDS.BGM, volume: config.bgmVolume }),
  addBusTrack({ id: AUDIO_BUS_IDS.SE, volume: config.seVolume }),
  addBusTrack({ id: AUDIO_BUS_IDS.VOICE, volume: config.voiceVolume }),
]);

// ============================================================================
// Chapter 1: Intro (イントロ)
// ============================================================================

export const scenario: NovelMessage[] = [
  sequence([
    // Setup UI
    addWidgets([
      w.layout({
        id: 'root',
        className:
          'w-screen h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 flex flex-col items-center justify-center relative overflow-hidden select-none',
      })([
        // Background layer
        w.layout({
          id: BG_LAYER_ID,
          className: 'absolute inset-0 z-0',
        })([]),

        // Image display layer (for centered images)
        w.layout({
          id: IMAGE_DISPLAY_ID,
          className:
            'absolute inset-0 z-5 flex items-center justify-center pointer-events-none',
        })([]),

        // Character display layer
        w.layout({
          id: CHARACTER_LAYOUT_ID,
          className: 'absolute inset-0 z-10',
        })([]),

        // Speech bubble layer
        w.layout({
          id: SPEECH_BUBBLE_LAYOUT_ID,
          className: 'absolute inset-0 z-20 pointer-events-none',
        })([]),

        // Content layer for textbox mode
        w.layout({
          id: 'content-layer',
          className:
            'absolute inset-0 flex flex-col items-center justify-between p-4 z-30',
        })([
          w.layout({
            id: TEXTBOX_ID,
            className: 'w-full flex justify-center px-4 pb-4',
          })([]),
        ]),

        // Fade overlay layer
        w.layout({
          id: FADE_OVERLAY_ID,
          className:
            'absolute inset-0 z-50 bg-black pointer-events-none opacity-0 transition-opacity',
        })([]),

        // Narration text layer (highest z-index, above fade overlay)
        w.layout({
          id: NARRATION_LAYER_ID,
          className:
            'absolute inset-0 z-60 flex items-center justify-center pointer-events-none',
        })([]),
      ]),
    ]),

    fadeOut(0),
    delay(1000),

    changeBackground('bg-room', BACKGROUNDS.room),
    fadeIn(1000),
    delay(1000),

    playBGM('bgm-tyrannosaurus', BGM.TYRANNOSAURUS_NEEDLE_ROOD, true),
    playSE(SE.EXPLOSION),
    showCharacter('zundamon', CHARACTER_IMAGES.zundamon.smile, 'right'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V001),
    showSpeechBubble('zundamon', 'うおーーーーーー！！！', {
      fontSize: '3xl',
      bold: true,
      textSpeed: 100,
    }),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V002),
    showSpeechBubble('zundamon', 'ノベルゲームが、作りたいのだ！！！', {
      fontSize: '3xl',
      bold: true,
      textSpeed: 100,
    }),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    showCharacter('metan', CHARACTER_IMAGES.metan.speechless, 'left'),
    playCharacterVoice('metan', VOICE_METAN.V001),
    showSpeechBubble(
      'metan',
      'はぁ……いつにもましてうるさいですね。今日はどうしたんですか？',
    ),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V003),
    showSpeechBubble('zundamon', 'めたん、聞いてほしいのだ！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V004),
    showSpeechBubble('zundamon', 'ノベルゲームが作りたいのだ！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.thinking),
    playCharacterVoice('metan', VOICE_METAN.V002),
    showSpeechBubble(
      'metan',
      'ノベルゲーム？　なんでまたノベルゲームなの？　ゲームならRPGとかアクションとか、ほかにも色々あるでしょ。',
    ),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V005),
    showSpeechBubble('zundamon', 'よくぞ聞いてくれのだ！'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smug),
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
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.surprise),
    playCharacterVoice('metan', VOICE_METAN.V003),
    showSpeechBubble('metan', 'なんか始まったぞおい。'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V007),
    showSpeechBubble(
      'zundamon',
      'これは単なるゲームではない……言葉と、音と、イラストが紡ぎだす総合芸術なのだ。',
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
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V010),
    showSpeechBubble(
      'zundamon',
      'でもノベルゲームはそれだけではない！　なんとイラストも使えてしまうのだ！',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V011),
    showSpeechBubble(
      'zundamon',
      'これだけ表現の幅があるなら、きっとすごいものが作れるに違いないのだ！',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
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
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    playSE(SE.TAIKO_DON),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V013),
    showSpeechBubble('zundamon', 'ない！', { textSpeed: 100 }),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    playCharacterVoice('metan', VOICE_METAN.V005),
    showSpeechBubble('metan', '音楽は？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.joke),
    playSE(SE.TAIKO_DON),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V014),
    showSpeechBubble('zundamon', 'ない！！', { textSpeed: 100 }),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    playCharacterVoice('metan', VOICE_METAN.V006),
    showSpeechBubble('metan', 'イラストは？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    playSE(SE.TAIKO_DON2),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V015),
    showSpeechBubble('zundamon', 'ないのだ！！！', {
      textSpeed: 100,
      bold: true,
    }),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.thinking),
    playCharacterVoice('metan', VOICE_METAN.V007),
    showSpeechBubble('metan', 'プログラミングは？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smug),
    playSE(SE.SOLEMN_ATMOSPHERE),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V016),
    showSpeechBubble('zundamon', 'それはできるのだ！！！！！', {
      fontSize: '3xl',
      bold: true,
      textSpeed: 100,
    }),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.speechless),
    playCharacterVoice('metan', VOICE_METAN.V008),
    showSpeechBubble('metan', 'はぁ。左様ですか……。'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V017),
    showSpeechBubble(
      'zundamon',
      'というわけでめたん、次合うまでに神ゲーを作ってくるから、それまで首洗って待っておくのだ！',
    ),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    applyAnimation('zundamon', 'goodbye-right'),
    playSE(SE.PYUN_ESCAPE),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V018),
    showSpeechBubble('zundamon', 'じゃあな！', {
      fontSize: '3xl',
      bold: true,
      textSpeed: 100,
    }),
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
    fadeOut(1000),
    delay(1000),
    hideSpeechBubble('metan'),
    removeCharacter('metan'),
    removeCharacter('zundamon'),
    removeChannel(VOICE_CHANNEL_IDS.metan),
    showCharacter('metan', CHARACTER_IMAGES.metan.default, 'left'),
    showCharacter('zundamon', CHARACTER_IMAGES.zundamon.sunglasses, 'right'),
    playSE(SE.CHICKEN_CRY),
    showNarrationText('2週間後……', '6xl', true),
    delay(1000),
    hideNarrationText(),
    fadeIn(1000),
    delay(1000),
    playBGM('bgm-march', BGM.MARCH),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V019),
    showSpeechBubble('zundamon', 'やぁめたん。'),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.speechless),
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
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    playCharacterVoice('metan', VOICE_METAN.V011),
    showSpeechBubble('metan', '何が？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playSE(SE.SPREAD_PAPER),
    showCenteredImage('img-src', IMAGES.src),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.surprise),
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
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.speechless),
    playCharacterVoice('metan', VOICE_METAN.V013),
    showSpeechBubble('metan', 'いやわかるけど。なんの？'),
  ]),

  sequence([
    hideSpeechBubble('metan'),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V022),
    showSpeechBubble('zundamon', 'ゲーム『エンジン』の、ソースコードなのだ。', {
      fontSize: '3xl',
      bold: true,
      textSpeed: 50,
    }),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.surprise),
    playCharacterVoice('metan', VOICE_METAN.V014),
    showSpeechBubble('metan', '……はい？'),
  ]),

  // ============================================================================
  // Chapter 2: tsuzuriとは
  // ============================================================================

  sequence([
    hideSpeechBubble('metan'),
    removeChannel('bgm-march'),
    fadeOut(0),
    playSE(SE.MAN_YAHOO),
    showNarrationText('関数型ノベルゲームエンジン "tsuzuri" 解説', '5xl'),

    removeCharacter('zundamon'),
    removeCharacter('metan'),
    hideCenteredImage('img-src'),
    removeWidgets([SPEECH_BUBBLE_LAYOUT_ID, TEXTBOX_ID]),

    initTextBoxLayout(),
    showCharacter(
      'zundamon',
      CHARACTER_IMAGES.zundamon.default,
      'right',
      'small',
    ),
    showCharacter('metan', CHARACTER_IMAGES.metan.default, 'left', 'small'),

    delay(2000),
    hideNarrationText(),

    playBGM('bgm-explanation', BGM.EXPLANATION, true),
    fadeIn(1000),
    delay(1000),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'このノベルゲームエンジンを、僕は "tsuzuri" と呼んでいるのだ。',
    ),
  ]),

  sequence([
    showExplanatoryImage('img-elm-arch', IMAGES.elmArchitecture, 'xl', 50),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'tsuzuriは関数型プログラミング、特にElm Architectureというソフトウェアアーキテクチャを強く意識して開発しているのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'tsuzuriではノベルゲームを実現するうえで必要なModelと呼ばれる状態と、Messageと呼ばれるゲームのイベントのようなもの。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'またtsuzuriの内部では、Message発火時にModelの更新を担うUpdate関数というものも存在しているのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '実装者は、作りたいシナリオに合わせてMessageを組み合わせることで、自由にノベルゲームを制作することができるのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.surprise),
    hideCenteredImage('img-elm-arch'),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'ちょっと待ってずんだもん。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'どうしたのだ？',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.difficulty),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'さっぱりわからないわ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      '申し訳ないのだけれど、関数型プログラミングとか、Elm Architectureとか、あまりなじみがないわ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '大丈夫！　要はこういうことなのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'まず一番重要なこととして頭に入れて欲しいのは、tsuzuriではノベルゲームを『発行したMessageの集積結果』と捉えていることなのだ。',
    ),
  ]),

  sequence([
    showExplanatoryImage('img-game', IMAGES.gameExample1, '3xl'),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '例えばこういったゲーム画面があったとするのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '今画面にはキャラクターがいて、背景があって、テキストボックスがあって、BGMが流れているのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'この状態から、ユーザーが画面をクリックしたとするのだ。',
    ),
  ]),

  sequence([
    updateWidgetProps('img-game', {
      widgetType: 'Image',
      props: { src: IMAGES.gameExample2 },
    }),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'すると、テキストボックスの中身が変わったのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'tsuzuriではこれを、ユーザーのクリックというアクションによって、『テキストを進めるMessageが発行された』と考えるのだ。',
    ),
  ]),

  sequence([
    hideCenteredImage('img-game'),
    showExplanatoryImage('img-elm-arch', IMAGES.elmArchitecture, 'xl', 50),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'このMessageが発行されると、ゲームの裏側にあるModelのうち、UIの表示に関する情報をUpdate関数が更新して、そのModelの変更に基づいてUIも更新されるのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'ほかの要素についても同じなのだ。キャラの立ち絵を変更するのもUI変化だし、BGMやSEを流すのは、音声操作のMessageによる状態変化と捉えられるのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'こう考えることで、いま目の前にあるゲームの状態は、過去に発行された大量のMessageの積み重ねによってできた結果と捉えることができるのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.thinking),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      '……逆に言えば、ノベルゲームを動かすのに必要なパラメータとしてのModelと、ノベルゲームで起こりうるイベントとしてのMessageさえわかってしまえば、ゲームエンジンは作れてしまうと。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'そしてtsuzuriの利用者は、Messageを組み合わせてtsuzuriに与えてあげれば、その通りに動くゲームが作れる、ということかしら？',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'ほぼその理解であっているのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'とにかくMessageを投げてModelを更新、このメッセージ駆動でゲームを構築できるというのが、tsuzuriのコンセプトになっているのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.thinking),
    hideCenteredImage('img-elm-arch'),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'でもどうしてこんな作りにしたの？　ゲーム開発は詳しくないけど、少なくともこうした設計がメジャーだとは思えないわ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'メリットがいくつかあるのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '例えば、会話ログの構築が簡単になるのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'ノベルゲームでは、過去の会話ログをさかのぼって閲覧する機能がよくあるのだけれど、これは過去に発行したMessageから絞り込めば一瞬で作れるのだ！',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'ノベルゲームの現在の状態は、過去のMessageを積み重ねた結果だから、発行されたMessageを保持していれば、昔の状態は復元可能、ってことかしら？',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'その通りなのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'もちろん、文字通りすべてのMessageをゲームの最後まで保持し続けるのはさすがに厳しいと思うのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'でもノベルゲームにおいて、本当の意味で常に保持しておかなければならない情報は、特殊なギミックがない限り、実はそんなに多くないはずなのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'まぁゲーム自体、基本はシンプルな作りですからねぇ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'あとはセーブデータの管理がかなり楽なのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'tsuzuriにおいて、ゲームの状態は1つの大きなModelによって管理されているのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'つまり、このModelをどこかに保存するだけで、セーブのロジックはほぼ完成するのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.joke),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '「本当にそんなことできるの？」と思ったそこのキミ！　いい着眼点なのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.speechless),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'まだ何も言ってないです。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '実は、ここには関数型プログラミングの考えが大きく反映されているのだ。',
    ),
  ]),

  sequence([
    showExplanatoryImage('img-elm-arch', IMAGES.elmArchitecture, 'xl', 50),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '例えば、さっきModel、Message、Update関数は紹介したけど、Elm Architectureには、ModelをUIに変換するView関数というのも存在するのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'このView関数は、Modelを受け取ってUIっぽいものを返却するのだけど、この関数は参照透過性が保証されているのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.difficulty),
    ...showCharacterDialog('めたん', CHARACTER_COLORS.metan, 'さん……何？'),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '参照透過性なのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    hideCenteredImage('img-elm-arch'),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '例えばめたん、f(x) = 2xという関数がある時に、f(2)を計算するとどうなるのだ？',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.surprise),
    ...showCharacterDialog('めたん', CHARACTER_COLORS.metan, 'え、4だけど。'),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'じゃあ今日の天気がくもりのときのf(2)は？',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.speechless),
    ...showCharacterDialog('めたん', CHARACTER_COLORS.metan, 'いや4でしょ。'),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.joke),
    clearTextBox(),
    playSE(SE.HIRAMEKU2),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '昨日めたんの体重が増えてショックだったときのf(2)は？',
      100,
    ),
  ]),

  sequence([
    clearTextBox(),
    playSE(SE.VIOLIN_HORROR),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.angry),
    ...showCharacterDialog('めたん', CHARACTER_COLORS.metan, '殴るわよ？', 100),
  ]),

  sequence([
    clearTextBox(),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'そう、結果は変わらないのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '同じ引数を渡したときに、常に同じ計算結果が得られる。これが参照透過性なのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'そしてこの性質を、ゲームエンジン自体が持っているとしたらどうなるのだ？',
    ),
  ]),

  sequence([
    clearTextBox(),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.surprise),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'あっ……同じModelを引数として与えれば、同じ進行状況を再現できる……？',
    ),
  ]),

  sequence([
    clearTextBox(),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'ザッツコレクトなのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '一般的なElm Architectureでは、基本的にUIの再現のみしか考慮されていないのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'でもtsuzuriでは、Modelから実際の音声への変換もサポートしているから、BGMの再現も一発なのだ！',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'だからセーブではModelを保存するだけを考えればよいのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.sad),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'まぁtsuzuriではセーブやロードの機能を提供しているから、利用者がセーブについて考える必要はほぼないのだけどね……。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.smile),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      '至れり尽くせりね。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.thinking),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'ところで、なんとなくtsuzuriの仕組みはわかってきたけど、実際にどうやってゲームを作ればいいのかしら？',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'とても簡単なのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '繰り返しになるけど、tsuzuriにおいてノベルゲームはMessageの集積なのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    showExplanatoryImage('img-scenario', IMAGES.scenarioExample1, '3xl', 50),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'だからこんな感じに、ゲームで起こることをMessageで表現してあげればいいのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '最初のinitMessageは、BGMの設定やレイアウトの初期化を行うMessageなのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '次のscenarioという配列は、文字通りゲームのシナリオを時系列で表現しているのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      '最初に作成したテキストボックスに、二つテキストを追加しているみたいね。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.smile),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'あら、レイアウトやテキストボックスにTailwind CSSが使われているわね。これは便利そう。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '各ウィジェットはクラス名を公開しているから、それを使うスタイリング方法であれば何でもOKなのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'シナリオができたら、ゲームに組み込むのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    updateWidgetProps('img-scenario', {
      widgetType: 'Image',
      props: { src: IMAGES.scenarioExample2 },
    }),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'シナリオの配列から、ユーザーのアクションに合わせて一つずつMessageをtsuzuriに投げれば、これで完成なのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.surprise),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'はやっ！　確かに、やっていることはかなりシンプルね。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '実際にはもう少しコードを書くことになるけど、基本的な作りはこれだけなのだ！',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'シンプルなAPIで、TypeScriptの強力な型システムを持ちつつ、UIライブラリも非依存だから、ReactでもVueでもVanillaJSでも、好きに選択できるのはtsuzuriの強みなのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.smile),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'Web開発の知識がある方には、かなり扱いやすそうね。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.thinking),
    hideCenteredImage('img-scenario'),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'でもずんだもん、逆にtsuzuriの弱点って何かあるの？',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'もちろんあるのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.thinking),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '一番大きいのは、何でも機能を提供しているゲームエンジンではないから、それ以外の実装はすべて自分でやる必要があるのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '例えば、他のノベルゲームエンジンなら、テンプレートが豊富にあったり、デザインがある程度整ったところから制作を始められたり、便利な機能もたくさん提供されているのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.thinking),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'でもtsuzuriは、そういったものを基本的に提供していないのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'tsuzuriの責務は、ノベルゲームにおける最も基本的な仕組みをモデリングすることだけに特化しているのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'だから逆に言えば、自分でやらないといけないことは多いけど、tsuzuriから強いる制約は少ないから、シナリオからUIまでかなり自由に構築できると思うのだ。',
    ),
  ]),

  sequence([
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      '使いこなすにはそれなりの知識や技術力が求められるけど、逆にあるなら自由にゲーム制作ができる、という感じね。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'そういうことなのだ！',
    ),
  ]),

  sequence([
    clearTextBox(),
    fadeOut(500),
    delay(500),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    fadeIn(500),
    delay(500),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '他にもUIライブラリ非依存の状態管理ライブラリを自作したり、オーディオ周りの宣言的な管理方法とかの、かなり尖ったこともやっているのだ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      '詳しいことは技術記事が上がっているから、そちらもチェックしてほしいのだ！',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.smile),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'ここまで凝っていると面白そうね、今度読んでみるわ。',
    ),
  ]),

  sequence([
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.default),
    ...showCharacterDialog(
      'めたん',
      CHARACTER_COLORS.metan,
      'ところでずんだもん、ゲームエンジンはいいのだけど、肝心のノベルゲームは作っているの？',
    ),
  ]),

  sequence([
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.default),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'ん？　何を言ってるのだ？',
    ),
  ]),

  sequence([
    playSE(SE.TAIKO_DON2),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.surprise),
    changeCharacterExpression('zundamon', CHARACTER_IMAGES.zundamon.smile),
    ...showCharacterDialog(
      'ずんだもん',
      CHARACTER_COLORS.zundamon,
      'これがノベルゲームなのだ！',
      0,
    ),
  ]),

  // ============================================================================
  // Chapter 3: おわり
  // ============================================================================

  sequence([
    clearTextBox(),
    removeChannel('bgm-explanation'),

    // Cleanup Chapter 2 UI
    removeCharacter('zundamon'),
    removeCharacter('metan'),
    removeWidgets(['textbox-container']),
    // Switch back to speech bubble mode
    addWidgets([
      w.layout({
        id: SPEECH_BUBBLE_LAYOUT_ID,
        className: 'absolute inset-0 z-20 pointer-events-none',
      })([]),
    ]),
    // Show game mock image
    showExplanatoryImage('img-game', IMAGES.tutorial, 'xl', 50),

    // Show characters again
    showCharacter('zundamon', CHARACTER_IMAGES.zundamon.smile, 'right'),
    showCharacter('metan', CHARACTER_IMAGES.metan.default, 'left'),
    playSE(SE.LEVEL_UP),
    playCharacterVoice('zundamon', VOICE_ZUNDAMON.V023),
    showSpeechBubble('zundamon', 'っていうノベルゲームなのだ！', {
      textSpeed: 100,
    }),
  ]),

  sequence([
    hideSpeechBubble('zundamon'),
    changeCharacterExpression('metan', CHARACTER_IMAGES.metan.angry),
    playSE(SE.INSERT_TSUKKOMI),
    playCharacterVoice('metan', VOICE_METAN.V015),
    showSpeechBubble('metan', 'ややこしいわ！', { textSpeed: 100 }),
  ]),

  sequence([
    playSE(SE.CHANCHAN),
    fadeOut(0),
    hideSpeechBubble('metan'),
    hideCenteredImage('img-game'),
    removeCharacter('zundamon'),
    removeCharacter('metan'),
    removeChannel(VOICE_CHANNEL_IDS.zundamon),
    removeChannel(VOICE_CHANNEL_IDS.metan),
    showNarrationText('おわり', '6xl'),
  ]),

  // Credits
  sequence([
    hideNarrationText(),

    // Show credits
    addWidgets([
      w.layout({
        id: 'credits-container',
        className:
          'absolute inset-0 z-50 flex items-center justify-center bg-black',
      })([
        w.layout({
          id: 'credits',
          className:
            'max-w-6xl text-white text-base leading-relaxed p-8 overflow-y-auto grid grid-cols-3 gap-8',
        })([
          w.text({
            id: 'credits-title',
            content: 'クレジット',
            className: 'text-4xl font-bold text-center mb-8 col-span-3',
          }),

          // Column 1: 音声・立ち絵
          w.layout({
            id: 'credits-column-1',
            className: 'space-y-4',
          })([
            w.text({
              id: 'credits-voice-title',
              content: '音声',
              className: 'text-2xl font-bold mb-2',
            }),
            w.text({
              id: 'credits-voice-zundamon',
              content: 'ずんだもん: VOICEVOX',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-voice-zundamon-link',
              content: 'https://voicevox.hiroshiba.jp/product/zundamon',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-voice-metan',
              content: '四国めたん: VOICEVOX',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-voice-metan-link',
              content: 'https://voicevox.hiroshiba.jp/product/shikoku_metan',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-illust-title',
              content: '立ち絵',
              className: 'text-2xl font-bold mt-6 mb-2',
            }),
            w.text({
              id: 'credits-illust-zundamon',
              content: 'ずんだもん: 坂本アヒル 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-illust-zundamon-link',
              content: 'https://seiga.nicovideo.jp/seiga/im10788496',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-illust-metan',
              content: '四国めたん: 坂本アヒル 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-illust-metan-link',
              content: 'https://seiga.nicovideo.jp/seiga/im10791276',
              className: 'ml-8 text-sm',
            }),
          ]),

          // Column 2: BGM・SE
          w.layout({
            id: 'credits-column-2',
            className: 'space-y-4',
          })([
            w.text({
              id: 'credits-bgm-title',
              content: 'BGM',
              className: 'text-2xl font-bold mb-2',
            }),
            w.text({
              id: 'credits-bgm-1',
              content: 'カラフルな積み木: こばっと 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-bgm-1-link',
              content: 'https://dova-s.jp/bgm/play22528.html',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-bgm-2',
              content: '暴竜ニードルード: MAKOOTO 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-bgm-2-link',
              content: 'https://dova-s.jp/bgm/play20645.html',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-bgm-3',
              content: '平氏: 伊藤ケイスケ 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-bgm-3-link',
              content: 'https://dova-s.jp/bgm/play22894.html',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-bgm-4',
              content: '進軍: 田中芳典 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-bgm-4-link',
              content: 'https://dova-s.jp/bgm/play11346.html',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-bgm-5',
              content: '解説しましょ: ichi-h',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-bgm-5-link',
              content:
                'https://soundcloud.com/ichi-h/eb2d8d78-0779-4e04-bafa-731e4a5a48d4',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-se-title',
              content: 'SE',
              className: 'text-2xl font-bold mt-6 mb-2',
            }),
            w.text({
              id: 'credits-se',
              content: '効果音ラボ 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-se-link',
              content: 'https://soundeffect-lab.info',
              className: 'ml-8 text-sm',
            }),
          ]),

          // Column 3: 画像
          w.layout({
            id: 'credits-column-3',
            className: 'space-y-4',
          })([
            w.text({
              id: 'credits-image-title',
              content: '画像',
              className: 'text-2xl font-bold mb-2',
            }),
            w.text({
              id: 'credits-image-bg',
              content: '背景: みんちりえ 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-image-bg-link',
              content: 'https://min-chi.material.jp',
              className: 'ml-8 text-sm',
            }),
            w.text({
              id: 'credits-image-src',
              content: '素材: いらすとや 様',
              className: 'ml-4',
            }),
            w.text({
              id: 'credits-image-src-link',
              content: 'https://www.irasutoya.com/',
              className: 'ml-8 text-sm',
            }),
          ]),
        ]),
      ]),
    ]),
  ]),
];
