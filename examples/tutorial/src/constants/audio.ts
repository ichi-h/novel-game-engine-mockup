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

// Import voice files - Zundamon
import zundamon001 from '../assets/voices/zundamon/001_zundamon.mp3';
import zundamon002 from '../assets/voices/zundamon/002_zundamon.mp3';
import zundamon003 from '../assets/voices/zundamon/003_zundamon.mp3';
import zundamon004 from '../assets/voices/zundamon/004_zundamon.mp3';
import zundamon005 from '../assets/voices/zundamon/005_zundamon.mp3';
import zundamon006 from '../assets/voices/zundamon/006_zundamon.mp3';
import zundamon007 from '../assets/voices/zundamon/007_zundamon.mp3';
import zundamon008 from '../assets/voices/zundamon/008_zundamon.mp3';
import zundamon009 from '../assets/voices/zundamon/009_zundamon.mp3';
import zundamon010 from '../assets/voices/zundamon/010_zundamon.mp3';
import zundamon011 from '../assets/voices/zundamon/011_zundamon.mp3';
import zundamon012 from '../assets/voices/zundamon/012_zundamon.mp3';
import zundamon013 from '../assets/voices/zundamon/013_zundamon.mp3';
import zundamon014 from '../assets/voices/zundamon/014_zundamon.mp3';
import zundamon015 from '../assets/voices/zundamon/015_zundamon.mp3';
import zundamon016 from '../assets/voices/zundamon/016_zundamon.mp3';
import zundamon017 from '../assets/voices/zundamon/017_zundamon.mp3';
import zundamon018 from '../assets/voices/zundamon/018_zundamon.mp3';
import zundamon019 from '../assets/voices/zundamon/019_zundamon.mp3';
import zundamon020 from '../assets/voices/zundamon/020_zundamon.mp3';
import zundamon021 from '../assets/voices/zundamon/021_zundamon.mp3';
import zundamon022 from '../assets/voices/zundamon/022_zundamon.mp3';
import zundamon023 from '../assets/voices/zundamon/023_zundamon.mp3';

// Import voice files - Metan
import metan001 from '../assets/voices/metan/001_metan.mp3';
import metan002 from '../assets/voices/metan/002_metan.mp3';
import metan003 from '../assets/voices/metan/003_metan.mp3';
import metan004 from '../assets/voices/metan/004_metan.mp3';
import metan005 from '../assets/voices/metan/005_metan.mp3';
import metan006 from '../assets/voices/metan/006_metan.mp3';
import metan007 from '../assets/voices/metan/007_metan.mp3';
import metan008 from '../assets/voices/metan/008_metan.mp3';
import metan009 from '../assets/voices/metan/009_metan.mp3';
import metan010 from '../assets/voices/metan/010_metan.mp3';
import metan011 from '../assets/voices/metan/011_metan.mp3';
import metan012 from '../assets/voices/metan/012_metan.mp3';
import metan013 from '../assets/voices/metan/013_metan.mp3';
import metan014 from '../assets/voices/metan/014_metan.mp3';
import metan015 from '../assets/voices/metan/015_metan.mp3';
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

/**
 * Voice file paths - Zundamon
 */
export const VOICE_ZUNDAMON = {
  V001: zundamon001,
  V002: zundamon002,
  V003: zundamon003,
  V004: zundamon004,
  V005: zundamon005,
  V006: zundamon006,
  V007: zundamon007,
  V008: zundamon008,
  V009: zundamon009,
  V010: zundamon010,
  V011: zundamon011,
  V012: zundamon012,
  V013: zundamon013,
  V014: zundamon014,
  V015: zundamon015,
  V016: zundamon016,
  V017: zundamon017,
  V018: zundamon018,
  V019: zundamon019,
  V020: zundamon020,
  V021: zundamon021,
  V022: zundamon022,
  V023: zundamon023,
} as const;

/**
 * Voice file paths - Metan
 */
export const VOICE_METAN = {
  V001: metan001,
  V002: metan002,
  V003: metan003,
  V004: metan004,
  V005: metan005,
  V006: metan006,
  V007: metan007,
  V008: metan008,
  V009: metan009,
  V010: metan010,
  V011: metan011,
  V012: metan012,
  V013: metan013,
  V014: metan014,
  V015: metan015,
} as const;
