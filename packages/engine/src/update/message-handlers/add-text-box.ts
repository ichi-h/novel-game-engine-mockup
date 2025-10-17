import type { BaseMessage } from 'elmish';
import type { NovelModel } from '../../model';
import { textBox } from '../../objects';

export interface AddTextBoxMessage extends BaseMessage {
  type: 'AddTextBox';
  id: string;
  layoutId: string;
  style?: string;
}

export const handleAddTextBox = (
  model: NovelModel,
  msg: AddTextBoxMessage,
): NovelModel => {
  const newTextBox = textBox({
    id: msg.id,
    ...(msg.style !== undefined && { style: msg.style }),
  })([]);
  model.ui.addObject(newTextBox, msg.layoutId);
  return model;
};
