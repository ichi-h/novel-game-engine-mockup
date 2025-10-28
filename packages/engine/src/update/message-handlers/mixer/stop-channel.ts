import type { BaseMessage, ReturnModel, Update } from 'elmish';
import { type ApplyMixer, type FadeOutMs, hasId, map } from '@/mixer-v2';
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
  update: Update<NovelModel<Component>, NovelMessage<Component>>,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  if (!hasId(model.mixer, msg.channelId)) {
    return update(model, {
      type: 'Error',
      value: new Error(
        `Channel with ID ${msg.channelId} does not exist in the mixer.`,
      ),
    });
  }

  const mixer = map((c) =>
    c.id === msg.channelId
      ? {
          ...c,
          playStatus: 'Stopped' as const,
          ...(msg.fadeOutMs !== undefined ? { fadeOutMs: msg.fadeOutMs } : {}),
        }
      : c,
  )(model.mixer);

  return [
    {
      ...model,
      mixer,
      isApplyingMixer: true,
    },
    createApplyMixerCommand(mixer, applyMixer),
  ];
};
