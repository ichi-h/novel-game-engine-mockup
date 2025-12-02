import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, img } from '@/ui';

export interface ShowImageMessage extends BaseMessage {
  type: 'ShowImage';
  id?: string;
  layoutId: string;
  src: string;
  style?: string;
}

export const showImage = (
  layoutId: string,
  src: string,
  id?: string,
  style?: string,
): ShowImageMessage => {
  return {
    type: 'ShowImage',
    layoutId,
    src,
    ...(id !== undefined ? { id } : {}),
    ...(style !== undefined ? { style } : {}),
  };
};

export const handleShowImage = (
  model: NovelModel,
  msg: ShowImageMessage,
): NovelModel => {
  const newImg = img({
    src: msg.src,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.style !== undefined && { style: msg.style }),
  });
  return {
    ...model,
    ui: addWidget(model.ui, newImg, msg.layoutId),
  };
};
