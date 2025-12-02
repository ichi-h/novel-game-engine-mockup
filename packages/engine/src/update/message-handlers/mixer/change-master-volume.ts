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

export const handleChangeMasterVolume = (
  model: NovelModel,
  msg: ChangeMasterVolumeMessage,
  update: Update<NovelModel, NovelMessage>,
): ReturnModel<NovelModel, NovelMessage> => {
  const mixer = {
    ...model.mixer,
    volume: msg.masterVolume,
  };

  return update(
    {
      ...model,
      mixer,
    },
    {
      type: 'ApplyMixer',
    },
  );
};
