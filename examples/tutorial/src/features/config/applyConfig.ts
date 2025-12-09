import type { NovelMessage } from '@ichi-h/tsuzuri-core';
import { changeChannelVolume, updateConfig } from '@ichi-h/tsuzuri-core';
import { AUDIO_BUS_IDS } from '../../constants/audio';
import { getModel } from '../game/engine';
import type { GameConfig } from './constants';
import { convertTextSpeed } from './utils';

export const updateBGMVolumeMessage = (volume: number): NovelMessage => {
  return changeChannelVolume({
    channelId: AUDIO_BUS_IDS.BGM,
    volume,
  });
};

export const updateSEVolumeMessage = (volume: number): NovelMessage => {
  return changeChannelVolume({
    channelId: AUDIO_BUS_IDS.SE,
    volume,
  });
};

export const updateVoiceVolumeMessage = (volume: number): NovelMessage => {
  return changeChannelVolume({
    channelId: AUDIO_BUS_IDS.VOICE,
    volume,
  });
};

export const updateTextSpeedMessage = (textSpeed: number): NovelMessage => {
  const currentModel = getModel();
  return updateConfig({
    ...currentModel.config,
    textAnimationSpeed: convertTextSpeed(textSpeed),
  });
};

/**
 * Build an array of messages to apply the game config to the novel model
 * This includes updating mixer bus track volumes and text animation speed
 */
export const buildConfigMessages = (config: GameConfig): NovelMessage[] => {
  return [
    updateBGMVolumeMessage(config.bgmVolume),
    updateSEVolumeMessage(config.seVolume),
    updateVoiceVolumeMessage(config.voiceVolume),
    updateTextSpeedMessage(config.textSpeed),
  ];
};
