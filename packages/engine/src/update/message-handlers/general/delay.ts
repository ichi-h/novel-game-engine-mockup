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

export const handleDelay = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: DelayMessage,
): ReturnModel<NovelModel<CustomState>, DelayCompletedMessage> => {
  return [
    {
      ...model,
      status: { value: 'Delaying', remainingTime: msg.durationMs },
    },
    async () =>
      await new Promise<DelayCompletedMessage>((resolve) => {
        setTimeout(() => {
          resolve({ type: 'DelayCompleted' });
        }, msg.durationMs);
      }),
  ];
};

export const handleDelayCompleted = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  _msg: DelayCompletedMessage,
): NovelModel<CustomState> => {
  return {
    ...model,
    status: { value: 'Processed' },
  };
};
