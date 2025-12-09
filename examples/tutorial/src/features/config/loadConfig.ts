import {
  CONFIG_STORAGE_KEY,
  DEFAULT_CONFIG,
  type GameConfig,
} from './constants';

/**
 * Load the current game configuration from localStorage.
 *
 * If the config was changed in localStorage after loading, the returned object
 * will not reflect those changes.
 */
export const loadConfig = (): GameConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as GameConfig;
    }
  } catch (error) {
    console.error('Failed to load config from localStorage:', error);
  }
  return structuredClone(DEFAULT_CONFIG);
};
