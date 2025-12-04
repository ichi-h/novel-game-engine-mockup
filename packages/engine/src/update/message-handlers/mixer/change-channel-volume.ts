import type { BaseMessage, ReturnModel, Update } from 'elmish';
import { hasId, map, type Volume } from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface ChangeChannelVolumeMessage extends BaseMessage {
  type: 'ChangeChannelVolume';
  channelId: string;
  volume: Volume;
}

export const changeChannelVolume = ({
  channelId,
  volume,
}: Omit<ChangeChannelVolumeMessage, 'type'>): ChangeChannelVolumeMessage => {
  return {
    type: 'ChangeChannelVolume',
    channelId,
    volume,
  };
};

export const handleChangeChannelVolume = (
  model: NovelModel,
  msg: ChangeChannelVolumeMessage,
  update: Update<NovelModel, NovelMessage>,
): ReturnModel<NovelModel, NovelMessage> => {
  if (!hasId(model.mixer.value, msg.channelId)) {
    return update(model, {
      type: 'Error',
      value: new Error(
        `Channel with ID ${msg.channelId} does not exist in the mixer.`,
      ),
    });
  }

  const mixer = map((c) => {
    if (c.id === msg.channelId) {
      return {
        ...c,
        volume: msg.volume,
      };
    }
    return c;
  })(model.mixer.value);

  return update(
    {
      ...model,
      mixer: {
        ...model.mixer,
        value: mixer,
      },
    },
    {
      type: 'ApplyMixer',
    },
  );
};
