import type { BaseMessage, ReturnModel } from 'elmish';
import type { Volume } from '../../mixer';
import type { NovelModel } from '../../model';

export interface ChangeMasterVolumeMessage extends BaseMessage {
  type: 'ChangeMasterVolume';
  name: string;
  masterVolume: Volume;
}

export const handleChangeMasterVolume = (
  model: NovelModel,
  _msg: ChangeMasterVolumeMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
