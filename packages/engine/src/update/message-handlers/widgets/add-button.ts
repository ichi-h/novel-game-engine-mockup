import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, w } from '@/ui';
import type { NovelMessage } from '@/update/message';

export interface AddButtonMessage extends BaseMessage {
  type: 'AddButton';
  id?: string;
  layoutId?: string;
  label: string;
  onClick: NovelMessage;
  style?: string;
}

export const addButton = ({
  id,
  layoutId,
  label,
  onClick,
  style,
}: Omit<AddButtonMessage, 'type'>): AddButtonMessage => {
  return {
    type: 'AddButton',
    label,
    onClick,
    ...(layoutId !== undefined ? { layoutId } : {}),
    ...(id !== undefined ? { id } : {}),
    ...(style !== undefined ? { style } : {}),
  };
};

export const handleAddButton = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: AddButtonMessage,
): NovelModel<CustomState> => {
  const newButton = w.button({
    label: msg.label,
    onClick: msg.onClick,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.style !== undefined && { style: msg.style }),
  });
  return {
    ...model,
    ui: addWidget(model.ui, newButton, msg.layoutId),
  };
};
