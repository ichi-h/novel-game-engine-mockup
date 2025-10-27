import type { BaseMessage, ReturnModel } from 'elmish';
import type { ApplyMixer, Samples, Track, Volume } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '../message';
import { createApplyMixerCommand } from './utils';

export interface AddChannelMessage extends BaseMessage {
  type: 'AddChannel';
  name: string;
  src: string;
  volume?: Volume;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

export const addChannel = (
  name: string,
  src: string,
  volume?: Volume,
  loop?: { start: Samples; end: Samples },
): AddChannelMessage => {
  return {
    type: 'AddChannel',
    name,
    src,
    ...(volume !== undefined ? { volume } : {}),
    ...(loop !== undefined ? { loop } : {}),
  };
};

export const handleAddChannel = <Component>(
  model: NovelModel<Component>,
  msg: AddChannelMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const newChannel: Track = {
    id: msg.name,
    type: 'Track',
    playStatus: 'Standby',
    volume: msg.volume ?? 1.0,
    src: msg.src,
    ...(msg.loop !== undefined ? { isLoop: msg.loop } : {}),
  };

  const updatedChannels = [...model.mixer.channels, newChannel];

  const updatedMixer = {
    ...model.mixer,
    channels: updatedChannels,
  };

  const updatedModel = {
    ...model,
    mixer: updatedMixer,
    isApplyingMixer: true,
  };

  return [updatedModel, createApplyMixerCommand(updatedMixer, applyMixer)];
};
