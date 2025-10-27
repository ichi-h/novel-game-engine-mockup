import type { BaseMessage, ReturnModel } from 'elmish';
import type { ApplyMixer, FadeOutMs } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '../message';
import { createApplyMixerCommand } from './utils';

export interface StopChannelMessage extends BaseMessage {
  type: 'StopChannel';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

export const stopChannel = (
  channelName: string,
  fadeOutMs?: FadeOutMs,
): StopChannelMessage => {
  return {
    type: 'StopChannel',
    channelName,
    ...(fadeOutMs !== undefined ? { fadeOutMs } : {}),
  };
};

export const handleStopChannel = <Component>(
  model: NovelModel<Component>,
  msg: StopChannelMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const updatedChannels = model.mixer.channels.map((channel) => {
    if (channel.id === msg.channelName) {
      return {
        ...channel,
        playStatus: 'Stopped' as const,
        ...(msg.fadeOutMs !== undefined ? { fadeOutMs: msg.fadeOutMs } : {}),
      };
    }
    return channel;
  });

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
