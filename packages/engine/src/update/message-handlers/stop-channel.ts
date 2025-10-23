import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeOutMs } from '../../mixer';
import type { NovelModel } from '../../model';

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
): ReturnModel<NovelModel<Component>, never> => {
  model.mixer.stopChannel(msg.channelName, msg.fadeOutMs);
  return model;
};
