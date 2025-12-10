import type { NovelMessage } from '@ichi-h/tsuzuri-core';
import {
  addImage,
  addText,
  addTextBox,
  addTrack,
  addWidgets,
  clearTextBox as clearTextBoxMsg,
  playChannel,
  removeChannel,
  removeWidgets,
  sequence,
  updateWidgetProps,
  updateWidgetStyle,
  w,
} from '@ichi-h/tsuzuri-core';
import scenarioExample1 from '../../assets/images/code/scenario_example_1.webp';
import scenarioExample2 from '../../assets/images/code/scenario_example_2.webp';
import srcImage from '../../assets/images/code/src.webp';
import elmArchitecture from '../../assets/images/elm/elm_architecture.webp';
import gameExample1 from '../../assets/images/game/game_example_1.webp';
import gameExample2 from '../../assets/images/game/game_example_2.webp';
import metanAngry from '../../assets/images/metan/angry.webp';
// Import character images - Metan
import metanDefault from '../../assets/images/metan/defalt.webp';
import metanDifficulty from '../../assets/images/metan/difficulty.webp';
import metanSmile from '../../assets/images/metan/smile.webp';
import metanSpeechless from '../../assets/images/metan/speechless.webp';
import metanSurprise from '../../assets/images/metan/surprise.webp';
import metanThinking from '../../assets/images/metan/thinking.webp';
// Import background images
import roomBg from '../../assets/images/room.webp';
// Import other images
import sakutaro from '../../assets/images/sakutaro.webp';
// Import character images - Zundamon
import zundamonDefault from '../../assets/images/zundamon/default.webp';
import zundamonDifficulty from '../../assets/images/zundamon/difficulty.webp';
import zundamonJoke from '../../assets/images/zundamon/joke.webp';
import zundamonSad from '../../assets/images/zundamon/sad.webp';
import zundamonSmile from '../../assets/images/zundamon/smile.webp';
import zundamonSmug from '../../assets/images/zundamon/smug.webp';
import zundamonSunglasses from '../../assets/images/zundamon/sunglasses.webp';
import zundamonSurprise from '../../assets/images/zundamon/surprise.webp';
import zundamonThinking from '../../assets/images/zundamon/thinking.webp';
import { AUDIO_BUS_IDS } from '../../constants/audio';

// Widget IDs
export const TEXTBOX_ID = 'main-textbox';
export const SPEECH_BUBBLE_LAYOUT_ID = 'speech-bubble-layout';
export const CHARACTER_LAYOUT_ID = 'character-display';
export const BG_LAYER_ID = 'background-layer';
export const IMAGE_DISPLAY_ID = 'image-display';
export const NARRATION_LAYER_ID = 'narration-layer';
export const FADE_OVERLAY_ID = 'fade-overlay';

// Character images
export const CHARACTER_IMAGES = {
  zundamon: {
    default: zundamonDefault,
    smile: zundamonSmile,
    thinking: zundamonThinking,
    difficulty: zundamonDifficulty,
    surprise: zundamonSurprise,
    sad: zundamonSad,
    smug: zundamonSmug,
    joke: zundamonJoke,
    sunglasses: zundamonSunglasses,
  },
  metan: {
    default: metanDefault,
    smile: metanSmile,
    thinking: metanThinking,
    difficulty: metanDifficulty,
    surprise: metanSurprise,
    angry: metanAngry,
    speechless: metanSpeechless,
  },
} as const;

// Background images
export const BACKGROUNDS = {
  room: roomBg,
} as const;

// Other images
export const IMAGES = {
  sakutaro: sakutaro,
  elmArchitecture: elmArchitecture,
  src: srcImage,
  scenarioExample1: scenarioExample1,
  scenarioExample2: scenarioExample2,
  gameExample1: gameExample1,
  gameExample2: gameExample2,
} as const;

// Common styles
export const COMMON_STYLES = {
  nameText: 'font-bold text-2xl mb-2 drop-shadow-md',
  dialogText: 'text-gray-800 leading-relaxed',
  textBoxDialogText: 'text-white leading-relaxed',
  characterImage: 'drop-shadow-2xl select-none',
  speechBubble:
    'max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl',
} as const;

// Character colors
export const CHARACTER_COLORS = {
  zundamon: 'text-green-600',
  metan: 'text-pink-600',
} as const;

/**
 * Clear the text box
 */
export const clearTextBox = (): NovelMessage => clearTextBoxMsg(TEXTBOX_ID);

/**
 * Initialize text box layout for explanation mode
 */
export const initTextBoxLayout = (): NovelMessage => {
  return addWidgets(
    [
      w.layout({
        id: 'textbox-container',
        className:
          'absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-black/70 backdrop-blur-md px-8 py-6 shadow-2xl',
      })([
        w.textBox({
          id: TEXTBOX_ID,
          className: 'max-w-4xl mx-auto text-xl leading-relaxed text-white',
        })([]),
      ]),
    ],
    'content-layer',
  );
};

/**
 * Show character name in textbox
 */
export const showCharacterName = (name: string, color: string): NovelMessage =>
  addText({
    textBoxId: TEXTBOX_ID,
    content: name,
    className: `${color} ${COMMON_STYLES.nameText}`,
    speed: 100,
  });

/**
 * Show dialog text in textbox
 */
export const showDialog = (text: string): NovelMessage =>
  addText({
    textBoxId: TEXTBOX_ID,
    content: text,
    className: COMMON_STYLES.textBoxDialogText,
  });

/**
 * Show character dialog in textbox (name + text)
 */
export const showCharacterDialog = (
  name: string,
  color: string,
  text: string,
): NovelMessage[] => [
  clearTextBox(),
  showCharacterName(name, color),
  showDialog(text),
];

// Chapter 2 specific helper (with clearTextBox for proper text replacement)
export const showCharacterDialog2 = (
  name: string,
  color: string,
  text: string,
): NovelMessage[] => [
  clearTextBox(),
  showCharacterName(name, color),
  showDialog(text),
];

/**
 * Show character image
 */
export const showCharacter = (
  id: 'zundamon' | 'metan',
  src: string,
  position: 'left' | 'right',
  scale: 'small' | 'medium' | 'large' = 'large',
): NovelMessage => {
  const character = id.includes('zundamon') ? 'zundamon' : 'metan';
  const containerId = `${character}-container`;
  const positionClass = position === 'left' ? 'left-32' : 'right-32';
  const scaleClass = {
    small: 'scale-50',
    medium: 'scale-75',
    large: 'scale-100',
  }[scale];

  return addWidgets(
    [
      w.layout({
        id: containerId,
        className: `absolute bottom-10 ${positionClass} flex flex-col-reverse items-center gap-4 animate-fade-in ${scaleClass}`,
      })([
        w.img({
          id,
          src,
          className: COMMON_STYLES.characterImage,
        }),
        w.layout({
          id: `${character}-bubble-slot`,
          className: 'w-full flex justify-center min-h-0',
        })([]),
      ]),
    ],
    CHARACTER_LAYOUT_ID,
  );
};

export const changeCharacterExpression = (
  id: 'zundamon' | 'metan',
  src: string,
): NovelMessage => {
  return updateWidgetProps(id, {
    widgetType: 'Image',
    props: { src },
  });
};

/**
 * Voice channel IDs for each character
 */
export const VOICE_CHANNEL_IDS = {
  zundamon: 'voice-zundamon',
  metan: 'voice-metan',
} as const;

/**
 * Remove character image
 */
export const hideCharacter = (id: string): NovelMessage => {
  return updateWidgetStyle({
    widgetId: id,
    className: 'opacity-0',
    method: 'add',
  });
};

export const applyAnimation = (
  id: string,
  animation: 'goodbye-right',
): NovelMessage => {
  return updateWidgetStyle({
    widgetId: id,
    className: `animate-${animation}`,
    method: 'add',
  });
};

export const removeCharacter = (
  character: 'zundamon' | 'metan',
): NovelMessage => {
  return removeWidgets([`${character}-container`]);
};

interface SpeechBubbleOptions {
  fontSize?: 'xl' | '2xl' | '3xl';
  bold?: boolean;
  textSpeed?: number;
}

/**
 * Show speech bubble for character
 * This returns a single message that can be used in a sequence
 */
export const showSpeechBubble = (
  character: 'zundamon' | 'metan',
  text: string,
  options?: SpeechBubbleOptions,
): NovelMessage => {
  const bubbleId = `${character}-bubble`;
  const bubbleSlotId = `${character}-bubble-slot`;
  const color = CHARACTER_COLORS[character];
  const bgColor =
    character === 'zundamon' ? 'bg-green-100/95' : 'bg-pink-100/95';

  return sequence([
    addTextBox({
      id: bubbleId,
      layoutId: bubbleSlotId,
      className: `${COMMON_STYLES.speechBubble} ${bgColor} border-4 ${
        character === 'zundamon' ? 'border-green-300' : 'border-pink-300'
      } animate-fade-in`,
    }),
    addText({
      textBoxId: bubbleId,
      content: text,
      className: `${color} ${COMMON_STYLES.dialogText} ${options?.bold ? 'font-bold' : ''} text-${options?.fontSize ?? 'xl'}`,
      speed: options?.textSpeed,
    }),
  ]);
};

/**
 * Remove speech bubble for character
 */
export const hideSpeechBubble = (
  character: 'zundamon' | 'metan',
): NovelMessage => {
  const bubbleId = `${character}-bubble`;
  return removeWidgets([bubbleId]);
};

export const showExitSpeechBubble = (
  character: 'zundamon' | 'metan',
  text: string,
  position: 'left' | 'right',
): NovelMessage => {
  const bubbleId = `${character}-exit-bubble`;
  const color = CHARACTER_COLORS[character];
  const bgColor =
    character === 'zundamon' ? 'bg-green-100/95' : 'bg-pink-100/95';
  const positionClass = position === 'left' ? 'left-32' : 'right-32';

  return addWidgets(
    [
      w.layout({
        id: bubbleId,
        className: `absolute bottom-[35rem] ${positionClass} ${COMMON_STYLES.speechBubble} ${bgColor} border-4 ${
          character === 'zundamon' ? 'border-green-300' : 'border-pink-300'
        } animate-fade-in`,
      })([
        w.text({
          id: `${bubbleId}-text`,
          content: text,
          className: `${color} ${COMMON_STYLES.dialogText}`,
        }),
      ]),
    ],
    SPEECH_BUBBLE_LAYOUT_ID,
  );
};

export const hideExitSpeechBubble = (
  character: 'zundamon' | 'metan',
): NovelMessage => {
  const bubbleId = `${character}-exit-bubble`;
  return removeWidgets([bubbleId]);
};

/**
 * Change background image
 */
export const changeBackground = (id: string, src: string): NovelMessage =>
  addImage({
    layoutId: BG_LAYER_ID,
    src,
    id,
    className: 'absolute inset-0 w-full h-full object-cover animate-fade-in',
  });

/**
 * Show centered image (for illustrations, diagrams, etc.)
 */
export const showCenteredImage = (id: string, src: string): NovelMessage =>
  addImage({
    layoutId: IMAGE_DISPLAY_ID,
    src,
    id,
    className: 'max-w-4xl max-h-[600px] object-contain',
  });

/**
 * Hide centered image
 */
export const hideCenteredImage = (id: string): NovelMessage =>
  removeWidgets([id]);

/**
 * Play BGM
 */
export const playBGM = (id: string, src: string, loop = true): NovelMessage =>
  sequence([
    addTrack({
      id,
      busTrackId: AUDIO_BUS_IDS.BGM,
      src,
      ...(loop ? { loop: { start: 0, end: -1 } } : {}),
    }),
    playChannel({ channelId: id }),
  ]);

/**
 * Play voice
 */
export const playVoice = (id: string, src: string): NovelMessage =>
  sequence([
    addTrack({
      id,
      busTrackId: AUDIO_BUS_IDS.VOICE,
      src,
    }),
    playChannel({ channelId: id }),
  ]);

/**
 * Play voice for a specific character (removes all previous voice channels)
 */
export const playCharacterVoice = (
  character: 'zundamon' | 'metan',
  src: string,
): NovelMessage =>
  sequence([
    // Remove both character voice channels to prevent overlap
    removeChannel(VOICE_CHANNEL_IDS.zundamon),
    removeChannel(VOICE_CHANNEL_IDS.metan),
    addTrack({
      id: VOICE_CHANNEL_IDS[character],
      busTrackId: AUDIO_BUS_IDS.VOICE,
      src,
    }),
    playChannel({ channelId: VOICE_CHANNEL_IDS[character] }),
  ]);

/**
 * Stop BGM
 */
export const stopBGM = (channelId: string): NovelMessage => {
  return removeChannel(channelId);
};

/**
 * Map duration in milliseconds to Tailwind duration class
 */
const getDurationClass = (durationMs: number): string => {
  if (durationMs === 0) return 'duration-0';
  if (durationMs <= 75) return 'duration-75';
  if (durationMs <= 100) return 'duration-100';
  if (durationMs <= 150) return 'duration-150';
  if (durationMs <= 200) return 'duration-200';
  if (durationMs <= 300) return 'duration-300';
  if (durationMs <= 500) return 'duration-500';
  if (durationMs <= 700) return 'duration-700';
  return 'duration-1000';
};

/**
 * Fade out (screen goes dark)
 * @param durationMs - Fade duration in milliseconds (default: 500ms)
 * Will be mapped to nearest Tailwind duration: 0, 75, 100, 150, 200, 300, 500, 700, 1000
 */
export const fadeOut = (durationMs: number = 500): NovelMessage => {
  const durationClass = getDurationClass(durationMs);
  return updateWidgetStyle({
    widgetId: FADE_OVERLAY_ID,
    className: `absolute inset-0 z-50 bg-black pointer-events-none opacity-100 transition-opacity ${durationClass}`,
    method: 'put',
  });
};

/**
 * Fade in (screen becomes visible)
 * @param durationMs - Fade duration in milliseconds (default: 500ms)
 * Will be mapped to nearest Tailwind duration: 0, 75, 100, 150, 200, 300, 500, 700, 1000
 */
export const fadeIn = (durationMs: number = 500): NovelMessage => {
  const durationClass = getDurationClass(durationMs);
  return updateWidgetStyle({
    widgetId: FADE_OVERLAY_ID,
    className: `absolute inset-0 z-50 bg-black pointer-events-none opacity-0 transition-opacity ${durationClass}`,
    method: 'put',
  });
};

/**
 * Show narration text in the center of the screen
 * @param text - Text to display
 * @param fontSize - Font size (default: '4xl')
 */
export const showNarrationText = (
  text: string,
  fontSize: '2xl' | '3xl' | '4xl' | '5xl' | '6xl' = '4xl',
  withAnimation = false,
): NovelMessage => {
  return addWidgets(
    [
      w.text({
        id: 'narration-text',
        content: text,
        className: `text-white text-${fontSize} font-bold text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${withAnimation ? 'animate-fade-text-in' : ''}`,
      }),
    ],
    NARRATION_LAYER_ID,
  );
};

/**
 * Hide narration text
 */
export const hideNarrationText = (): NovelMessage => {
  return removeWidgets(['narration-text']);
};
