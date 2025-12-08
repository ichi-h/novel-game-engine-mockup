import type { BaseMessage, ReturnModel, Update } from 'elmish';
import type { Volume } from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface ChangeMasterVolumeMessage extends BaseMessage {
  type: 'ChangeMasterVolume';
  masterVolume: Volume;
}

export const changeMasterVolume = (
  masterVolume: Volume,
): ChangeMasterVolumeMessage => {
  return {
    type: 'ChangeMasterVolume',
    masterVolume,
  };
};

export const handleChangeMasterVolume = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: ChangeMasterVolumeMessage,
  update: Update<NovelModel<CustomState>, NovelMessage<CustomState>>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
  return update(
    {
      ...model,
      mixer: {
        ...model.mixer,
        value: {
          ...model.mixer.value,
          volume: msg.masterVolume,
        },
      },
    },
    {
      type: 'ApplyMixer',
    },
  );
};
