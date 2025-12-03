import type { BaseMessage, ReturnModel, Update } from 'elmish';
import type { ApplyMixer } from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface ApplyMixerMessage extends BaseMessage {
  type: 'ApplyMixer';
}

export interface ApplyMixerCompletedMessage extends BaseMessage {
  type: 'ApplyMixerCompleted';
  error: Error | null;
}

export const applyMixer = (): ApplyMixerMessage => {
  return {
    type: 'ApplyMixer',
  };
};

export const handleApplyMixer = (
  model: NovelModel,
  _msg: ApplyMixerMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel, NovelMessage> => {
  return [
    {
      ...model,
      mixer: {
        ...model.mixer,
        isApplying: true,
      },
    },
    async () => {
      let error: Error | null = null;
      try {
        await applyMixer(model.mixer.value);
      } catch (e) {
        error = e instanceof Error ? e : new Error(String(e));
      }
      return {
        type: 'ApplyMixerCompleted',
        error,
      };
    },
  ];
};

export const handleApplyMixerCompleted = (
  model: NovelModel,
  msg: ApplyMixerCompletedMessage,
  update: Update<NovelModel, NovelMessage>,
): ReturnModel<NovelModel, NovelMessage> => {
  const updatedModel = {
    ...model,
    mixer: {
      ...model.mixer,
      isApplying: false,
    },
  };

  if (msg.error !== null) {
    return update(updatedModel, {
      type: 'Error',
      value: msg.error,
    });
  }

  return updatedModel;
};
