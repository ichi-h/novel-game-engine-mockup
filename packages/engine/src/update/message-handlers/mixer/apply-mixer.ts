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

export const handleApplyMixer = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  _msg: ApplyMixerMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
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

export const handleApplyMixerCompleted = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: ApplyMixerCompletedMessage,
  update: Update<NovelModel<CustomState>, NovelMessage<CustomState>>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
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
