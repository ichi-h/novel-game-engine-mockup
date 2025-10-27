import type { BaseMessage, ReturnModel, Update } from 'elmish';
import type { ApplyMixer, BusTrack, Volume } from '@/mixer-v2';
import { addChannelToMixer } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { createApplyMixerCommand } from './utils';

export interface AddBusTrackMessage extends BaseMessage {
  type: 'AddBusTrack';
  id: string;
  volume?: Volume;
  parentBusTrackId?: string;
}

export const addBusTrack = (
  id: string,
  volume?: Volume,
  parentBusTrackId?: string,
): AddBusTrackMessage => {
  return {
    type: 'AddBusTrack',
    id,
    ...(volume !== undefined ? { volume } : {}),
    ...(parentBusTrackId !== undefined ? { parentBusTrackId } : {}),
  };
};

export const handleAddBusTrack = <Component>(
  model: NovelModel<Component>,
  msg: AddBusTrackMessage,
  update: Update<NovelModel<Component>, NovelMessage<Component>>,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const newBusTrack: BusTrack = {
    id: msg.id,
    type: 'BusTrack',
    volume: msg.volume ?? 1.0,
    channels: [],
  };

  try {
    const mixer = addChannelToMixer(
      model.mixer,
      msg.parentBusTrackId,
      newBusTrack,
    );

    return [
      {
        ...model,
        mixer,
        isApplyingMixer: true,
      },
      createApplyMixerCommand(mixer, applyMixer),
    ];
  } catch (error) {
    if (error instanceof Error) {
      return update(model, {
        type: 'Error',
        value: error,
      });
    }
    return update(model, {
      type: 'Error',
      value: new Error(
        `An unknown error occurred while adding BusTrack: ${JSON.stringify(error)}`,
      ),
    });
  }
};
