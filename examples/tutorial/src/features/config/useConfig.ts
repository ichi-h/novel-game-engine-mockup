import { useState } from 'react';
import type { GameConfig } from './types';

const CONFIG_STORAGE_KEY = 'tsuzuri-tutorial-config';

const DEFAULT_CONFIG: GameConfig = {
  bgmVolume: 0.5,
  seVolume: 0.5,
  textSpeed: 0.5,
};

const loadConfig = (): GameConfig => {
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

const saveConfig = (config: GameConfig): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save config to localStorage:', error);
  }
};

/**
 * Hook to manage game configuration with localStorage persistence
 */
export function useConfig() {
  const [config, setConfig] = useState<GameConfig>(loadConfig);

  const updateBgmVolume = (volume: number) => {
    const newConfig = {
      ...config,
      bgmVolume: Math.max(0, Math.min(1, volume)),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const updateSeVolume = (volume: number) => {
    const newConfig = {
      ...config,
      seVolume: Math.max(0, Math.min(1, volume)),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const updateTextSpeed = (speed: number) => {
    const newConfig = {
      ...config,
      textSpeed: Math.max(0, Math.min(1, speed)),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    saveConfig(DEFAULT_CONFIG);
  };

  return {
    config,
    updateBgmVolume,
    updateSeVolume,
    updateTextSpeed,
    resetConfig,
  };
}
