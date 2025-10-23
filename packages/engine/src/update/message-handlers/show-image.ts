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
