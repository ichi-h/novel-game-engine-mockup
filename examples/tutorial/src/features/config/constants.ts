export const CONFIG_STORAGE_KEY = 'tsuzuri-tutorial-config';

export const DEFAULT_CONFIG = {
  /** BGM volume (0.0 - 1.0) */
  bgmVolume: 0.15,
  /** SE volume (0.0 - 1.0) */
  seVolume: 0.3,
  /** Voice volume (0.0 - 1.0) */
  voiceVolume: 1,
  /** Text display speed (0 - 100, higher = faster) */
  textSpeed: 85,
};

export type GameConfig = typeof DEFAULT_CONFIG;
