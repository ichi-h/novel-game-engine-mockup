import type { BaseMessage } from 'elmish';
import { img } from '@/ui';
import type { NovelModel } from '../../model';

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

export const handleShowImage = <Component>(
  model: NovelModel<Component>,
  msg: ShowImageMessage,
): NovelModel<Component> => {
  const newImg = img({
    src: msg.src,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.style !== undefined && { style: msg.style }),
  });
  model.ui.addWidget(newImg, msg.layoutId);
  return model;
};
