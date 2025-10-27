import type { BaseMessage, ReturnModel } from 'elmish';
import type { ApplyMixer, Volume } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { createApplyMixerCommand } from './utils';

export interface ChangeChannelVolumeMessage extends BaseMessage {
  type: 'ChangeChannelVolume';
  channelId: string;
  volume: Volume;
}

export const changeChannelVolume = (
  channelId: string,
  volume: Volume,
): ChangeChannelVolumeMessage => {
  return {
    type: 'ChangeChannelVolume',
    channelId,
    volume,
  };
};

export const handleChangeChannelVolume = <Component>(
  model: NovelModel<Component>,
  msg: ChangeChannelVolumeMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const updatedChannels = model.mixer.channels.map((channel) => {
    if (channel.id === msg.channelId) {
      return {
        ...channel,
        volume: msg.volume,
      };
    }
    return channel;
  });

  const updatedMixer = {
    ...model.mixer,
    channels: updatedChannels,
  };

  const updatedModel = {
    ...model,
    mixer: updatedMixer,
    isApplyingMixer: true,
  };

  return [updatedModel, createApplyMixerCommand(updatedMixer, applyMixer)];
};
