import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '@/model';

export interface DelayMessage extends BaseMessage {
  type: 'Delay';
  durationMs: number;
}

export interface DelayCompletedMessage extends BaseMessage {
  type: 'DelayCompleted';
}

export const delay = (durationMs: number): DelayMessage => {
  return {
    type: 'Delay',
    durationMs,
  };
};

export const handleDelay = (
  model: NovelModel,
  msg: DelayMessage,
): ReturnModel<NovelModel, DelayCompletedMessage> => {
  model.isDelaying = true;
  return [
    model,
    async () =>
      await new Promise<DelayCompletedMessage>((resolve) => {
        setTimeout(() => {
          resolve({ type: 'DelayCompleted' });
        }, msg.durationMs);
      }),
  ];
};

export const handleDelayCompleted = (
  model: NovelModel,
  _msg: DelayCompletedMessage,
): NovelModel => {
  model.isDelaying = false;
  return model;
};
