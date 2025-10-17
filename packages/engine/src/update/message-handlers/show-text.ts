import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface ShowTextMessage extends BaseMessage {
  type: 'ShowText';
  id?: string;
  messageBoxId: string;
  content: string;
  style?: string;
  turnImmediately?: boolean;
  clearAllInBox?: boolean;
  speed?: number;
}

export const handleShowText = (
  model: NovelModel,
  _msg: ShowTextMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
