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

export const handleShowText = (
  model: NovelModel,
  msg: ShowTextMessage,
): NovelModel => {
  const newText = text({
    content: msg.content,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.style !== undefined && { style: msg.style }),
    ...(msg.speed !== undefined && { speed: msg.speed }),
  });
  model.ui.addText(newText, msg.textBoxId);
  return model;
};
