import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, w } from '@/ui';

export interface AddTextBoxMessage extends BaseMessage {
  type: 'AddTextBox';
  id: string;
  layoutId: string;
  style?: string;
}

export const addTextBox = ({
  id,
  layoutId,
  style,
}: Omit<AddTextBoxMessage, 'type'>): AddTextBoxMessage => {
  return {
    type: 'AddTextBox',
    id,
    layoutId,
    ...(style !== undefined ? { style } : {}),
  };
};

export const handleAddTextBox = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: AddTextBoxMessage,
): NovelModel<CustomState> => {
  const newTextBox = w.textBox({
    id: msg.id,
    ...(msg.style !== undefined && { style: msg.style }),
  })([]);
  return {
    ...model,
    ui: addWidget(model.ui, newTextBox, msg.layoutId),
  };
};
