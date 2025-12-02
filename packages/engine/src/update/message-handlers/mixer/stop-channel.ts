import type { BaseMessage, ReturnModel, Update } from 'elmish';
import { type FadeOutMs, hasId, map } from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

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

export const handleStopChannel = (
  model: NovelModel,
  msg: StopChannelMessage,
  update: Update<NovelModel, NovelMessage>,
): ReturnModel<NovelModel, NovelMessage> => {
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

  return update(
    {
      ...model,
      mixer,
    },
    {
      type: 'ApplyMixer',
    },
  );
};
