import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeOutMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface PauseChannelMessage extends BaseMessage {
  type: 'PauseChannel';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

export const handlePauseChannel = (
  model: NovelModel,
  msg: PauseChannelMessage,
): ReturnModel<NovelModel, never> => {
  model.mixer.pauseChannel(msg.channelName, msg.fadeOutMs);
  return model;
};
