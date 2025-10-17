import type { BaseMessage, ReturnModel } from 'elmish';
import type { Volume } from '../../mixer';
import type { NovelModel } from '../../model';

export interface ChangeChannelVolumeMessage extends BaseMessage {
  type: 'ChangeChannelVolume';
  channelName: string;
  volume: Volume;
}

export const handleChangeChannelVolume = (
  model: NovelModel,
  _msg: ChangeChannelVolumeMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
