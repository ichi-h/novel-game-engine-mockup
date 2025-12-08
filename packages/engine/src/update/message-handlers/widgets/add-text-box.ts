import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, w } from '@/ui';

export interface AddTextBoxMessage extends BaseMessage {
  type: 'AddTextBox';
  id: string;
  layoutId: string;
  className?: string;
}

export const addTextBox = ({
  id,
  layoutId,
  className,
}: Omit<AddTextBoxMessage, 'type'>): AddTextBoxMessage => {
  return {
    type: 'AddTextBox',
    id,
    layoutId,
    ...(className !== undefined ? { className } : {}),
  };
};

export const handleAddTextBox = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: AddTextBoxMessage,
): NovelModel<CustomState> => {
  const newTextBox = w.textBox({
    id: msg.id,
    ...(msg.className !== undefined && { className: msg.className }),
  })([]);
  return {
    ...model,
    ui: addWidget(model.ui, newTextBox, msg.layoutId),
  };
};
