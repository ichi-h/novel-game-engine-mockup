import type { BaseMessage, ReturnModel, Update } from 'elmish';
import {
  type ApplyMixer,
  type DelayMs,
  type FadeInMs,
  type FadeOutMs,
  hasId,
  map,
  type OffsetMs,
} from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { createApplyMixerCommand } from './utils';

export interface PlayChannelMessage extends BaseMessage {
  type: 'PlayChannel';
  channelId: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  offsetMs?: OffsetMs;
}

export const playChannel = (
  channelId: string,
  delayMs?: DelayMs,
  offsetMs?: OffsetMs,
  fadeInMs?: FadeInMs,
  fadeOutMs?: FadeOutMs,
): PlayChannelMessage => {
  return {
    type: 'PlayChannel',
    channelId,
    ...(delayMs !== undefined ? { delayMs } : {}),
    ...(offsetMs !== undefined ? { offsetMs } : {}),
    ...(fadeInMs !== undefined ? { fadeInMs } : {}),
    ...(fadeOutMs !== undefined ? { fadeOutMs } : {}),
  };
};

export const handlePlayChannel = <Component>(
  model: NovelModel<Component>,
  msg: PlayChannelMessage,
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

  const { fadeInMs, fadeOutMs, delayMs, offsetMs } = msg;

  const mixer = map((c) =>
    c.id === msg.channelId
      ? {
          ...c,
          playStatus: 'Playing' as const,
          ...(fadeInMs !== undefined ? { fadeInMs } : {}),
          ...(fadeOutMs !== undefined ? { fadeOutMs } : {}),
          ...(delayMs !== undefined ? { delayMs } : {}),
          ...(offsetMs !== undefined ? { offsetMs } : {}),
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
