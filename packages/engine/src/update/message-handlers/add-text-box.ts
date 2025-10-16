import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface AddTextBoxMessage extends BaseMessage {
  type: 'AddTextBox';
  id: string;
  layoutId: string;
  style?: string;
}

export const handleAddTextBox = (
  model: NovelModel,
  msg: AddTextBoxMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
