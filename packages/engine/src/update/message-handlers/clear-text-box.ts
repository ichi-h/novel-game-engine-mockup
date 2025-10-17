import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';

export interface ClearTextBoxMessage extends BaseMessage {
  type: 'ClearTextBox';
  textBoxId: string;
}

export const handleClearTextBox = (
  model: NovelModel,
  msg: ClearTextBoxMessage,
): NovelModel => {
  model.ui.clearTextBox(msg.textBoxId);
  return model;
};
