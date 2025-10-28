import type { BaseMessage, ReturnModel } from 'elmish';
import type { ApplyMixer, FadeOutMs } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { createApplyMixerCommand } from './utils';

export interface StopChannelMessage extends BaseMessage {
  type: 'StopChannel';
  channelId: string;
  fadeOutMs?: FadeOutMs;
}

export const stopChannel = (
  channelId: string,
  fadeOutMs?: FadeOutMs,
): StopChannelMessage => {
  return {
    type: 'StopChannel',
    channelId,
    ...(fadeOutMs !== undefined ? { fadeOutMs } : {}),
  };
};

export const handleStopChannel = <Component>(
  model: NovelModel<Component>,
  msg: StopChannelMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const channels = model.mixer.channels.map((channel) => {
    if (channel.id === msg.channelId) {
      return {
        ...channel,
        playStatus: 'Stopped' as const,
        ...(msg.fadeOutMs !== undefined ? { fadeOutMs: msg.fadeOutMs } : {}),
      };
    }
    return channel;
  });

  const mixer = {
    ...model.mixer,
    channels,
  };

  return [
    {
      ...model,
      mixer,
      isApplyingMixer: true,
    },
    createApplyMixerCommand(mixer, applyMixer),
  ];
};
