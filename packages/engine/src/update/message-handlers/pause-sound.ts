import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeOutMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface PauseSoundMessage extends BaseMessage {
  type: 'PauseSound';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

export const handlePauseSound = (
  model: NovelModel,
  msg: PauseSoundMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
