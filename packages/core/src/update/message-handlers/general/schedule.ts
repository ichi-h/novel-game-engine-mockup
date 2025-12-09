import type { BaseMessage, ReturnModel } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface ScheduleMessage<CustomState = unknown> extends BaseMessage {
  type: 'ScheduleMessage';
  delayMs: number;
  message: NovelMessage<CustomState>;
}

export const schedule = <CustomState = unknown>(
  delayMs: number,
  message: NovelMessage<CustomState>,
): ScheduleMessage<CustomState> => {
  return {
    type: 'ScheduleMessage',
    delayMs,
    message,
  };
};

export const handleScheduleMessage = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: ScheduleMessage<CustomState>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
  return [
    model,
    async () =>
      await new Promise<NovelMessage<CustomState>>((resolve) => {
        setTimeout(() => {
          resolve(msg.message);
        }, msg.delayMs);
      }),
  ];
};
