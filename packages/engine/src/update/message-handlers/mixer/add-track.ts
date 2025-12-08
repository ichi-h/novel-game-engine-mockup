import type { BaseMessage, ReturnModel, Update } from 'elmish';
import { addChannel, type Samples, type Track, type Volume } from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface AddTrackMessage extends BaseMessage {
  type: 'AddTrack';
  id: string;
  src: string;
  busTrackId?: string;
  volume?: Volume;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

export const addTrack = ({
  id,
  src,
  busTrackId,
  volume,
  loop,
}: Omit<AddTrackMessage, 'type'>): AddTrackMessage => {
  return {
    type: 'AddTrack',
    id,
    src,
    ...(busTrackId !== undefined ? { busTrackId } : {}),
    ...(volume !== undefined ? { volume } : {}),
    ...(loop !== undefined ? { loop } : {}),
  };
};

export const handleAddTrack = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: AddTrackMessage,
  update: Update<NovelModel<CustomState>, NovelMessage<CustomState>>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
  const track: Track = {
    id: msg.id,
    type: 'Track',
    playStatus: 'Standby',
    volume: msg.volume ?? 1.0,
    src: msg.src,
    ...(msg.loop !== undefined ? { isLoop: msg.loop } : {}),
  };

  try {
    const mixer = addChannel(model.mixer.value, track, msg.busTrackId);

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
  } catch (error) {
    return update(model, {
      type: 'Error',
      value:
        error instanceof Error
          ? error
          : new Error('Unknown error occurred while adding Track'),
    });
  }
};
