import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';

export interface ClearTextBoxMessage extends BaseMessage {
  type: 'ClearTextBox';
  textBoxId: string;
}

export const clearTextBox = (textBoxId: string): ClearTextBoxMessage => {
  return {
    type: 'ClearTextBox',
    textBoxId,
  };
};

export const handleClearTextBox = <Component>(
  model: NovelModel<Component>,
  msg: ClearTextBoxMessage,
): NovelModel<Component> => {
  model.ui.clearTextBox(msg.textBoxId);
  return model;
};
