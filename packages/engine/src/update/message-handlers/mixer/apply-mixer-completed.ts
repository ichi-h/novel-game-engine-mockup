import type { BaseMessage, ReturnModel, Update } from 'elmish';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface ApplyMixerCompletedMessage extends BaseMessage {
  type: 'ApplyMixerCompleted';
  error: Error | null;
}

export const handleApplyMixerCompleted = (
  model: NovelModel,
  msg: ApplyMixerCompletedMessage,
  update: Update<NovelModel, NovelMessage>,
): ReturnModel<NovelModel, NovelMessage> => {
  const updatedModel = {
    ...model,
    isApplyingMixer: false,
  };

  if (msg.error !== null) {
    return update(updatedModel, {
      type: 'Error',
      value: msg.error,
    });
  }

  return updatedModel;
};
