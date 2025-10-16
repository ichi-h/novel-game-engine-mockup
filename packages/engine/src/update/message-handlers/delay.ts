import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface DelayMessage extends BaseMessage {
  type: 'Delay';
  durationMs: number;
}

export const handleDelay = (
  model: NovelModel,
  msg: DelayMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
