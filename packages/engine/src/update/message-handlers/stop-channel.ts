import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeOutMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface StopChannelMessage extends BaseMessage {
  type: 'StopChannel';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

export const handleStopChannel = (
  model: NovelModel,
  msg: StopChannelMessage,
): ReturnModel<NovelModel, never> => {
  model.mixer.stopChannel(msg.channelName, msg.fadeOutMs);
  return model;
};
