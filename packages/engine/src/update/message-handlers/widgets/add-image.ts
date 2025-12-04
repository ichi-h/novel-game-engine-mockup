import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, w } from '@/ui';

export interface AddImageMessage extends BaseMessage {
  type: 'ShowImage';
  id?: string;
  layoutId: string;
  src: string;
  style?: string;
}

export const addImage = (
  layoutId: string,
  src: string,
  id?: string,
  style?: string,
): AddImageMessage => {
  return {
    type: 'ShowImage',
    layoutId,
    src,
    ...(id !== undefined ? { id } : {}),
    ...(style !== undefined ? { style } : {}),
  };
};

export const handleAddImage = (
  model: NovelModel,
  msg: AddImageMessage,
): NovelModel => {
  const newImg = w.img({
    src: msg.src,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.style !== undefined && { style: msg.style }),
  });
  return {
    ...model,
    ui: addWidget(model.ui, newImg, msg.layoutId),
  };
};
