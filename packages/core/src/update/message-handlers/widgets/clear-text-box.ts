import type { BaseMessage } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';
import { clearTextBoxWidget } from '@/ui';

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

export const handleClearTextBox = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: ClearTextBoxMessage,
): NovelModel<CustomState> => {
  return {
    ...model,
    ui: clearTextBoxWidget(model.ui, msg.textBoxId),
  };
};
