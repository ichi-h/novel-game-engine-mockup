import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, textBox } from '@/ui';

export interface AddTextBoxMessage extends BaseMessage {
  type: 'AddTextBox';
  id: string;
  layoutId: string;
  style?: string;
}

export const addTextBox = (
  id: string,
  layoutId: string,
  style?: string,
): AddTextBoxMessage => {
  return {
    type: 'AddTextBox',
    id,
    layoutId,
    ...(style !== undefined ? { style } : {}),
  };
};

export const handleAddTextBox = <Component>(
  model: NovelModel<Component>,
  msg: AddTextBoxMessage,
): NovelModel<Component> => {
  const newTextBox = textBox({
    id: msg.id,
    ...(msg.style !== undefined && { style: msg.style }),
  })([]);
  return {
    ...model,
    ui: addWidget(model.ui, newTextBox, msg.layoutId),
  };
};
