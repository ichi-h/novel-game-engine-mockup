import colorfulBlocks from '../assets/bgm/カラフルな積み木.mp3';
import heishi from '../assets/bgm/平氏.mp3';
import tyrannosaurusNeedleRood from '../assets/bgm/暴竜ニードルード.mp3';
import explanation from '../assets/bgm/解説しましょ.mp3';
import march from '../assets/bgm/進軍.mp3';
import chanchan from '../assets/se/ちゃんちゃん♪3.mp3';
import hirameku from '../assets/se/ひらめく2.mp3';
import cancelButton from '../assets/se/キャンセルボタン.mp3';
import quizCorrect from '../assets/se/クイズ正解5.mp3';
import insertTsukkomi from '../assets/se/ツッコミを入れる.mp3';
import chickenCry from '../assets/se/ニワトリの鳴き声.mp3';
import violinHorror from '../assets/se/バイオリン恐怖音1.mp3';
import pyunEscape from '../assets/se/ピューンと逃げる.mp3';
import levelUp from '../assets/se/レベルアップ.mp3';
import swordSwing from '../assets/se/刀の素振り2.mp3';
import taikoDon2 from '../assets/se/和太鼓でドドン.mp3';
import taikoDon from '../assets/se/和太鼓でドン.mp3';
import decisionButton from '../assets/se/決定ボタン.mp3';
import explosion from '../assets/se/爆発1.mp3';
import manYahoo from '../assets/se/男衆.mp3';
import spreadPaper from '../assets/se/紙を広げる1.mp3';
import solemnAtmosphere from '../assets/se/荘厳な雰囲気.mp3';

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

/**
 * Sound effect file paths
 */
export const SE = {
  SPREAD_PAPER: spreadPaper,
  VIOLIN_HORROR: violinHorror,
  QUIZ_CORRECT: quizCorrect,
  EXPLOSION: explosion,
  SOLEMN_ATMOSPHERE: solemnAtmosphere,
  DECISION_BUTTON: decisionButton,
  INSERT_TSUKKOMI: insertTsukkomi,
  PYUN_ESCAPE: pyunEscape,
  LEVEL_UP: levelUp,
  CANCEL_BUTTON: cancelButton,
  CHICKEN_CRY: chickenCry,
  MAN_YAHOO: manYahoo,
  TAIKO_DON2: taikoDon2,
  HIRAMEKU: hirameku,
  TAIKO_DON: taikoDon,
  CHANCHAN: chanchan,
  SWORD_SWING: swordSwing,
} as const;
