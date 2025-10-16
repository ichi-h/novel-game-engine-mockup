import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface WaitForUserMessage extends BaseMessage {
  type: 'WaitForUser';
}

export const handleWaitForUser = (
  model: NovelModel,
  msg: WaitForUserMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
