import type { BaseMessage, ReturnModel } from 'elmish';
import type { ApplyMixer } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { createApplyMixerCommand } from './utils';

export interface RemoveChannelMessage extends BaseMessage {
  type: 'RemoveChannel';
  channelId: string;
}

export const removeChannel = (channelId: string): RemoveChannelMessage => {
  return {
    type: 'RemoveChannel',
    channelId,
  };
};

export const handleRemoveChannel = <Component>(
  model: NovelModel<Component>,
  msg: RemoveChannelMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const updatedChannels = model.mixer.channels.filter(
    (channel) => channel.id !== msg.channelId,
  );

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
