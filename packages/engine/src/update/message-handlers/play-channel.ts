import type { BaseMessage, ReturnModel } from 'elmish';
import type {
  ApplyMixer,
  DelayMs,
  FadeInMs,
  FadeOutMs,
  OffsetMs,
} from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '../message';
import { createApplyMixerCommand } from './utils';

export interface PlayChannelMessage extends BaseMessage {
  type: 'PlayChannel';
  channelName: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  offsetMs?: OffsetMs;
}

export const playChannel = (
  channelName: string,
  delayMs?: DelayMs,
  offsetMs?: OffsetMs,
  fadeInMs?: FadeInMs,
  fadeOutMs?: FadeOutMs,
): PlayChannelMessage => {
  return {
    type: 'PlayChannel',
    channelName,
    ...(delayMs !== undefined ? { delayMs } : {}),
    ...(offsetMs !== undefined ? { offsetMs } : {}),
    ...(fadeInMs !== undefined ? { fadeInMs } : {}),
    ...(fadeOutMs !== undefined ? { fadeOutMs } : {}),
  };
};

export const handlePlayChannel = <Component>(
  model: NovelModel<Component>,
  msg: PlayChannelMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const updatedChannels = model.mixer.channels.map((channel) => {
    if (channel.id === msg.channelName) {
      return {
        ...channel,
        playStatus: 'Playing' as const,
        ...(msg.fadeInMs !== undefined ? { fadeInMs: msg.fadeInMs } : {}),
        ...(msg.fadeOutMs !== undefined ? { fadeOutMs: msg.fadeOutMs } : {}),
        ...(msg.delayMs !== undefined ? { delayMs: msg.delayMs } : {}),
        ...(msg.offsetMs !== undefined ? { offsetMs: msg.offsetMs } : {}),
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
