export const CONFIG_STORAGE_KEY = 'tsuzuri-tutorial-config';

export const DEFAULT_CONFIG = {
  /** BGM volume (0.0 - 1.0) */
  bgmVolume: 0.5,
  /** SE volume (0.0 - 1.0) */
  seVolume: 0.5,
  /** Voice volume (0.0 - 1.0) */
  voiceVolume: 0.5,
  /** Text display speed (0.0 - 1.0, higher = faster) */
  textSpeed: 0.5,
};

export type GameConfig = typeof DEFAULT_CONFIG;
