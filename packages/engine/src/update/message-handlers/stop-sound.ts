import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeOutMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface StopSoundMessage extends BaseMessage {
  type: 'StopSound';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

export const handleStopSound = (
  model: NovelModel,
  _msg: StopSoundMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
