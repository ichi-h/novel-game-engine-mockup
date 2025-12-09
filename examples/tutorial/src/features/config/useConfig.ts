import { sequence } from '@ichi-h/tsuzuri-core';
import { useSyncExternalStore } from 'react';
import { send } from '../game/engine';
import {
  buildConfigMessages,
  updateBGMVolumeMessage,
  updateSEVolumeMessage,
  updateTextSpeedMessage,
  updateVoiceVolumeMessage,
} from './applyConfig';
import {
  CONFIG_STORAGE_KEY,
  DEFAULT_CONFIG,
  type GameConfig,
} from './constants';
import { loadConfig } from './loadConfig';

// External store implementation for config
let listeners: Array<() => void> = [];
let cachedConfig: GameConfig = loadConfig();

const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = () => {
  return cachedConfig;
};

const saveConfig = (config: GameConfig): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    // Update cache and notify all subscribers about the change
    cachedConfig = config;
    for (const listener of listeners) {
      listener();
    }
  } catch (error) {
    console.error('Failed to save config to localStorage:', error);
  }
};

/**
 * Hook to manage game configuration with localStorage persistence
 * Uses useSyncExternalStore to sync across all components
 */
export function useConfig() {
  const config = useSyncExternalStore(subscribe, getSnapshot);

  const updateBgmVolume = (volume: number) => {
    const newConfig = {
      ...config,
      bgmVolume: Math.max(0, Math.min(1, volume)),
    };
    saveConfig(newConfig);
    send(updateBGMVolumeMessage(newConfig.bgmVolume));
  };

  const updateSeVolume = (volume: number) => {
    const newConfig = {
      ...config,
      seVolume: Math.max(0, Math.min(1, volume)),
    };
    saveConfig(newConfig);
    send(updateSEVolumeMessage(newConfig.seVolume));
  };

  const updateVoiceVolume = (volume: number) => {
    const newConfig = {
      ...config,
      voiceVolume: Math.max(0, Math.min(1, volume)),
    };
    saveConfig(newConfig);
    send(updateVoiceVolumeMessage(newConfig.voiceVolume));
  };

  const updateTextSpeed = (speed: number) => {
    const newConfig = {
      ...config,
      textSpeed: Math.max(0, Math.min(1, speed)),
    };
    saveConfig(newConfig);
    send(updateTextSpeedMessage(newConfig.textSpeed));
  };

  const resetConfig = () => {
    saveConfig(DEFAULT_CONFIG);
    send(sequence(buildConfigMessages(DEFAULT_CONFIG)));
  };

  return {
    config,
    updateBgmVolume,
    updateSeVolume,
    updateVoiceVolume,
    updateTextSpeed,
    resetConfig,
  };
}
