import type { ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';
import type { NovelMessage, NovelMessageType } from '../message';
import {
  sequence,
  type TextAnimationCompletedMessage,
} from '../message-handlers';
import type { MiddlewareNext } from '../update';

const ignoreMessageTypes: NovelMessageType[] = [
  'TextAnimationCompleted',
  'DelayCompleted',
  'Error',
  'RecoverError',
  'ApplyMixerCompleted',
  'UpdateConfig',
];

export const textAnimationMiddleware = (
  model: NovelModel,
  msg: NovelMessage,
  next: MiddlewareNext,
): ReturnModel<NovelModel, NovelMessage> => {
  if (
    ignoreMessageTypes.includes(msg.type) ||
    (msg.type === 'Sequence' &&
      msg.messages.some((m) => ignoreMessageTypes.includes(m.type)))
  ) {
    return next(model, msg);
  }

  const completeAnimationTickets = model.animationTickets.filter(
    (t) => t.nextMessageCaught === 'complete',
  );
  const interruptAnimationTickets = model.animationTickets.filter(
    (t) => t.nextMessageCaught === 'interrupt',
  );

  if (interruptAnimationTickets.length > 0) {
    const sequenceMessage = sequence([
      ...interruptAnimationTickets.map(
        (t): TextAnimationCompletedMessage => ({
          type: 'TextAnimationCompleted',
          id: t.id,
        }),
      ),
      ...completeAnimationTickets.map(
        (t): TextAnimationCompletedMessage => ({
          type: 'TextAnimationCompleted',
          id: t.id,
        }),
      ),
    ]);

    return next(
      {
        ...model,
        status: { value: 'Intercepted', message: msg },
      },
      sequenceMessage,
    );
  }

  if (completeAnimationTickets.length > 0) {
    const sequenceMessage = sequence([
      ...completeAnimationTickets.map(
        (t): TextAnimationCompletedMessage => ({
          type: 'TextAnimationCompleted',
          id: t.id,
        }),
      ),
      msg,
    ]);

    return next(
      {
        ...model,
        status: { value: 'Processed' },
        index: model.index + 1,
      },
      sequenceMessage,
    );
  }

  return next(
    {
      ...model,
      status: { value: 'Processed' },
      index: model.index + 1,
    },
    msg,
  );
};
