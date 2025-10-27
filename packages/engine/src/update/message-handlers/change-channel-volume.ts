import type { BaseMessage, ReturnModel } from 'elmish';
import type { ApplyMixer, Volume } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '../message';
import { createApplyMixerCommand } from './utils';

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
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  // Find and update the channel's volume
  const updatedChannels = model.mixer.channels.map((channel) => {
    if (channel.id === msg.channelName) {
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
