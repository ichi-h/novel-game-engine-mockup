import type { BaseMessage, ReturnModel, Update } from 'elmish';
import type { BusTrack, Volume } from '@/mixer';
import { addChannel } from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

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

export const handleAddBusTrack = (
  model: NovelModel,
  msg: AddBusTrackMessage,
  update: Update<NovelModel, NovelMessage>,
): ReturnModel<NovelModel, NovelMessage> => {
  const newBusTrack: BusTrack = {
    id: msg.id,
    type: 'BusTrack',
    volume: msg.volume ?? 1.0,
    channels: [],
  };

  try {
    const mixer = addChannel(model.mixer, newBusTrack, msg.parentBusTrackId);

    return update(
      {
        ...model,
        mixer,
      },
      {
        type: 'ApplyMixer',
      },
    );
  } catch (error) {
    return update(model, {
      type: 'Error',
      value:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while adding BusTrack'),
    });
  }
};
