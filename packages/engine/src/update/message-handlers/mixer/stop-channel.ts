import type { BaseMessage, ReturnModel, Update } from 'elmish';
import { type FadeOutMs, hasId, map } from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface StopChannelMessage extends BaseMessage {
  type: 'StopChannel';
  channelId: string;
  fadeOutMs?: FadeOutMs;
}

export const stopChannel = ({
  channelId,
  fadeOutMs,
}: Omit<StopChannelMessage, 'type'>): StopChannelMessage => {
  return {
    type: 'StopChannel',
    channelId,
    ...(fadeOutMs !== undefined ? { fadeOutMs } : {}),
  };
};

export const handleStopChannel = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: StopChannelMessage,
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

  const mixer = map((c) =>
    c.id === msg.channelId
      ? {
          ...c,
          playStatus: 'Stopped' as const,
          ...(msg.fadeOutMs !== undefined ? { fadeOutMs: msg.fadeOutMs } : {}),
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
