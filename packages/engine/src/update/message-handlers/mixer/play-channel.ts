import type { BaseMessage, ReturnModel, Update } from 'elmish';
import {
  type DelayMs,
  type FadeInMs,
  type FadeOutMs,
  hasId,
  map,
  type OffsetMs,
} from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface PlayChannelMessage extends BaseMessage {
  type: 'PlayChannel';
  channelId: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  offsetMs?: OffsetMs;
}

export const playChannel = ({
  channelId,
  delayMs,
  offsetMs,
  fadeInMs,
  fadeOutMs,
}: Omit<PlayChannelMessage, 'type'>): PlayChannelMessage => {
  return {
    type: 'PlayChannel',
    channelId,
    ...(delayMs !== undefined ? { delayMs } : {}),
    ...(offsetMs !== undefined ? { offsetMs } : {}),
    ...(fadeInMs !== undefined ? { fadeInMs } : {}),
    ...(fadeOutMs !== undefined ? { fadeOutMs } : {}),
  };
};

export const handlePlayChannel = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: PlayChannelMessage,
  update: Update<NovelModel<CustomState>, NovelMessage<CustomState>>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
  if (!hasId(model.mixer.value, msg.channelId)) {
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
  )(model.mixer.value);

  return update(
    {
      ...model,
      mixer: {
        ...model.mixer,
        value: mixer,
      },
    },
    {
      type: 'ApplyMixer',
    },
  );
};
