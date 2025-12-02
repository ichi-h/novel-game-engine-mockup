import type { BaseMessage, ReturnModel } from 'elmish';
import type { AnimationTicket, NovelModel } from '@/model';
import { addText, text } from '@/ui';

export interface ShowTextMessage extends BaseMessage {
  type: 'ShowText';
  id?: string;
  textBoxId: string;
  content: string;
  style?: string;
  speed?: number;
  nextMessageCaught?: AnimationTicket['nextMessageCaught'];
}

export interface TextAnimationCompletedMessage extends BaseMessage {
  type: 'TextAnimationCompleted';
  id: string;
}

export const showText = (
  textBoxId: string,
  content: string,
  id?: string,
  style?: string,
  speed?: number,
  nextMessageCaught?: AnimationTicket['nextMessageCaught'],
): ShowTextMessage => {
  return {
    type: 'ShowText',
    textBoxId,
    content,
    ...(id !== undefined ? { id } : {}),
    ...(style !== undefined ? { style } : {}),
    ...(speed !== undefined ? { speed } : {}),
    ...(nextMessageCaught !== undefined ? { nextMessageCaught } : {}),
  };
};

export const calcAnimationTTL = (
  speed: number,
  charPosition: number,
): number => {
  const minDisplayTimePerChar = 200;
  const maxDisplayTimePerChar = 100;

  if (speed >= 100) return 0;

  if (speed <= 0) return minDisplayTimePerChar * charPosition;

  return maxDisplayTimePerChar * ((100 - speed) / 100) * charPosition;
};

export const handleShowText = <Component>(
  model: NovelModel<Component>,
  msg: ShowTextMessage,
): ReturnModel<NovelModel<Component>, TextAnimationCompletedMessage> => {
  const newText = text({
    content: msg.content,
    speed: msg.speed ?? model.config.textAnimationSpeed,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.style !== undefined && { style: msg.style }),
  });

  const animationTicket: AnimationTicket | null =
    newText.speed && newText.speed < 100
      ? {
          id: newText.id,
          ttl: calcAnimationTTL(newText.speed, msg.content.length),
          nextMessageCaught: msg.nextMessageCaught ?? 'interrupt',
        }
      : null;

  const result = {
    ...model,
    ui: addText(model.ui, newText, msg.textBoxId),
  };

  if (animationTicket === null) return result;

  return [
    {
      ...result,
      animationTickets: [...model.animationTickets, animationTicket],
    },
    () =>
      new Promise<TextAnimationCompletedMessage>((resolve) => {
        setTimeout(() => {
          resolve({
            type: 'TextAnimationCompleted',
            id: animationTicket.id,
          });
        }, animationTicket.ttl);
      }),
  ];
};

export const handleTextAnimationCompleted = <Component>(
  model: NovelModel<Component>,
  msg: TextAnimationCompletedMessage,
): NovelModel<Component> => {
  return {
    ...model,
    animationTickets: model.animationTickets.filter(
      (ticket) => ticket.id !== msg.id,
    ),
  };
};
