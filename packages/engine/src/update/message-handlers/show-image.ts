import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface ShowImageMessage extends BaseMessage {
  type: 'ShowImage';
  id?: string;
  layoutId: string;
  src: string;
  style?: string;
}

export const handleShowImage = (
  model: NovelModel,
  _msg: ShowImageMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
