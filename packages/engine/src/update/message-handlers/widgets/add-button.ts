import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, button } from '@/ui';
import type { NovelMessage } from '@/update/message';

export interface AddButtonMessage extends BaseMessage {
  type: 'AddButton';
  id?: string;
  layoutId?: string;
  label: string;
  onClick: NovelMessage;
  style?: string;
}

export const addButton = (
  label: string,
  onClick: NovelMessage,
  layoutId?: string,
  id?: string,
  style?: string,
): AddButtonMessage => {
  return {
    type: 'AddButton',
    label,
    onClick,
    ...(layoutId !== undefined ? { layoutId } : {}),
    ...(id !== undefined ? { id } : {}),
    ...(style !== undefined ? { style } : {}),
  };
};

export const handleAddButton = (
  model: NovelModel,
  msg: AddButtonMessage,
): NovelModel => {
  const newButton = button({
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
