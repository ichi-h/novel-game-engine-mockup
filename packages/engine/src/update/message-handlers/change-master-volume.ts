import type { BaseMessage, ReturnModel } from 'elmish';
import type { Volume } from '../../mixer';
import type { NovelModel } from '../../model';

export interface ChangeMasterVolumeMessage extends BaseMessage {
  type: 'ChangeMasterVolume';
  name: string;
  masterVolume: Volume;
}

export const handleChangeMasterVolume = <Component>(
  model: NovelModel<Component>,
  msg: ChangeMasterVolumeMessage,
): ReturnModel<NovelModel<Component>, never> => {
  model.mixer.changeMasterVolume(msg.masterVolume);
  return model;
};
