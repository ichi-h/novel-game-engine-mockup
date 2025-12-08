import type { ReturnModel } from '@ichi-h/elmish';
import type { NovelModel } from '../../model';
import type { NovelMessage } from '../message';
import {
  sequence,
  type TextAnimationCompletedMessage,
} from '../message-handlers';
import type { MiddlewareNext } from './types';

export const messageInterceptorMiddleware = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: NovelMessage<CustomState>,
  next: MiddlewareNext<CustomState>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
  if (msg.type !== 'Next') {
    return next(model, msg);
  }

  const mergeAnimationTickets = model.animationTickets.filter(
    (t) => t.nextMessageCaught === 'merge',
  );
  const insertAnimationTickets = model.animationTickets.filter(
    (t) => t.nextMessageCaught === 'insert',
  );

  if (insertAnimationTickets.length > 0) {
    const sequenceMessage = sequence([
      ...insertAnimationTickets.map(
        (t): TextAnimationCompletedMessage => ({
          type: 'TextAnimationCompleted',
          id: t.id,
        }),
      ),
      ...mergeAnimationTickets.map(
        (t): TextAnimationCompletedMessage => ({
          type: 'TextAnimationCompleted',
          id: t.id,
        }),
      ),
    ]);

    return next(
      {
        ...model,
        status: { value: 'Inserted', message: sequenceMessage, before: msg },
      },
      sequenceMessage,
    );
  }

  if (mergeAnimationTickets.length > 0) {
    const sequenceMessage = sequence([
      ...mergeAnimationTickets.map(
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
        status: { value: 'Merged', message: sequenceMessage },
      },
      sequenceMessage,
    );
  }

  return next(
    {
      ...model,
      status: { value: 'Processed' },
    },
    msg,
  );
};
