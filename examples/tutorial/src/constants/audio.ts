import colorfulBlocks from '../assets/bgm/カラフルな積み木.mp3';
import heishi from '../assets/bgm/平氏.mp3';
import tyrannosaurusNeedleRood from '../assets/bgm/暴竜ニードルード.mp3';
import explanation from '../assets/bgm/解説しましょ.mp3';
import march from '../assets/bgm/進軍.mp3';

/**
 * Audio bus track IDs for mixer channel management
 */
export const AUDIO_BUS_IDS = {
  BGM: 'bgm-bus',
  SE: 'se-bus',
  VOICE: 'voice-bus',
} as const;

/**
 * BGM file paths
 */
export const BGM = {
  COLORFUL_BLOCKS: colorfulBlocks,
  EXPLANATION: explanation,
  TYRANNOSAURUS_NEEDLE_ROOD: tyrannosaurusNeedleRood,
  HEISHI: heishi,
  MARCH: march,
} as const;
