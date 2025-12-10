import type { BaseMessage, ReturnModel } from '@ichi-h/elmish';
import type { AnimationTicket, NovelModel } from '@/model';
import { addTextWidget, w } from '@/ui';
import { calcTextAnimationDuration } from '@/update/animation';

export interface ShowAddMessage extends BaseMessage {
  type: 'AddText';
  id?: string;
  textBoxId: string;
  content: string;
  className?: string;
  speed?: number;
  nextMessageCaught?: AnimationTicket['nextMessageCaught'];
}

export interface TextAnimationCompletedMessage extends BaseMessage {
  type: 'TextAnimationCompleted';
  id: string;
}

export const addText = ({
  textBoxId,
  content,
  id,
  className,
  speed,
  nextMessageCaught,
}: Omit<ShowAddMessage, 'type'>): ShowAddMessage => {
  return {
    type: 'AddText',
    textBoxId,
    content,
    ...(id !== undefined ? { id } : {}),
    ...(className !== undefined ? { className } : {}),
    ...(speed !== undefined ? { speed } : {}),
    ...(nextMessageCaught !== undefined ? { nextMessageCaught } : {}),
  };
};

export const handleAddText = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: ShowAddMessage,
): ReturnModel<NovelModel<CustomState>, TextAnimationCompletedMessage> => {
  const newText = w.text({
    content: msg.content,
    speed: msg.speed ?? model.config.textAnimationSpeed,
    ...(msg.id !== undefined && { id: msg.id }),
    ...(msg.className !== undefined && { className: msg.className }),
  });

  const animationTicket: AnimationTicket | null =
    newText.speed && newText.speed < 100
      ? {
          id: newText.id,
          ttl: calcTextAnimationDuration(newText.speed, msg.content.length),
          nextMessageCaught: msg.nextMessageCaught ?? 'insert',
        }
      : null;

  const result = {
    ...model,
    ui: addTextWidget(model.ui, newText, msg.textBoxId),
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

export const handleTextAnimationCompleted = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: TextAnimationCompletedMessage,
): NovelModel<CustomState> => {
  return {
    ...model,
    animationTickets: model.animationTickets.filter(
      (ticket) => ticket.id !== msg.id,
    ),
  };
};
