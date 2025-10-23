import type { BaseMessage, ReturnModel } from 'elmish';
import type { Volume } from '../../mixer';
import type { NovelModel } from '../../model';

export interface ChangeChannelVolumeMessage extends BaseMessage {
  type: 'ChangeChannelVolume';
  channelName: string;
  volume: Volume;
}

export const changeChannelVolume = (
  channelName: string,
  volume: Volume,
): ChangeChannelVolumeMessage => {
  return {
    type: 'ChangeChannelVolume',
    channelName,
    volume,
  };
};

export const handleChangeChannelVolume = <Component>(
  model: NovelModel<Component>,
  msg: ChangeChannelVolumeMessage,
): ReturnModel<NovelModel<Component>, never> => {
  model.mixer.changeChannelVolume(msg.channelName, msg.volume);
  return model;
};
