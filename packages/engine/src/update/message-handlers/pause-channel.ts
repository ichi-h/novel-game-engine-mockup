import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeOutMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface PauseChannelMessage extends BaseMessage {
  type: 'PauseChannel';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

export const pauseChannel = (
  channelName: string,
  fadeOutMs?: FadeOutMs,
): PauseChannelMessage => {
  return {
    type: 'PauseChannel',
    channelName,
    ...(fadeOutMs !== undefined ? { fadeOutMs } : {}),
  };
};

export const handlePauseChannel = <Component>(
  model: NovelModel<Component>,
  msg: PauseChannelMessage,
): ReturnModel<NovelModel<Component>, never> => {
  model.mixer.pauseChannel(msg.channelName, msg.fadeOutMs);
  return model;
};
