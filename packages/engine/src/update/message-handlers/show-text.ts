import type { BaseMessage } from 'elmish';
import { text } from '@/ui';
import type { NovelModel } from '../../model';

export interface ShowTextMessage extends BaseMessage {
  type: 'ShowText';
  id?: string;
  textBoxId: string;
  content: string;
  style?: string;
  speed?: number;
}

export const showText = (
  textBoxId: string,
  content: string,
  id?: string,
  style?: string,
  speed?: number,
): ShowTextMessage => {
  return {
    type: 'ShowText',
    textBoxId,
    content,
    ...(id !== undefined ? { id } : {}),
    ...(style !== undefined ? { style } : {}),
    ...(speed !== undefined ? { speed } : {}),
  };
};

export const handleShowText = <Component>(
  model: NovelModel<Component>,
  msg: ShowTextMessage,
): NovelModel<Component> => {
  const newText = text({
    content: msg.content,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.style !== undefined && { style: msg.style }),
    ...(msg.speed !== undefined && { speed: msg.speed }),
  });
  model.ui.addText(newText, msg.textBoxId);
  return model;
};
