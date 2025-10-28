import type { BaseMessage, ReturnModel, Update } from 'elmish';
import {
  type ApplyMixer,
  hasIdInMixer,
  mapMixer,
  type Volume,
} from '@/mixer-v2';
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
  update: Update<NovelModel<Component>, NovelMessage<Component>>,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  if (!hasIdInMixer(model.mixer, msg.channelId)) {
    return update(model, {
      type: 'Error',
      value: new Error(
        `Channel with ID ${msg.channelId} does not exist in the mixer.`,
      ),
    });
  }

  const mixer = mapMixer((c) => {
    if (c.id === msg.channelId) {
      return {
        ...c,
        volume: msg.volume,
      };
    }
    return c;
  })(model.mixer);

  return [
    {
      ...model,
      mixer,
      isApplyingMixer: true,
    },
    createApplyMixerCommand(mixer, applyMixer),
  ];
};
