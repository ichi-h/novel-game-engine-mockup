import type { BaseMessage, ReturnModel, Update } from 'elmish';
import {
  type ApplyMixer,
  addChannelToMixer,
  type Samples,
  type Track,
  type Volume,
} from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { createApplyMixerCommand } from './utils';

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

export const addTrack = (
  id: string,
  src: string,
  busTrackId?: string,
  volume?: Volume,
  loop?: { start: Samples; end: Samples },
): AddTrackMessage => {
  return {
    type: 'AddTrack',
    id,
    src,
    ...(busTrackId !== undefined ? { busTrackId } : {}),
    ...(volume !== undefined ? { volume } : {}),
    ...(loop !== undefined ? { loop } : {}),
  };
};

export const handleAddTrack = <Component>(
  model: NovelModel<Component>,
  msg: AddTrackMessage,
  update: Update<NovelModel<Component>, NovelMessage<Component>>,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const track: Track = {
    id: msg.id,
    type: 'Track',
    playStatus: 'Standby',
    volume: msg.volume ?? 1.0,
    src: msg.src,
    ...(msg.loop !== undefined ? { isLoop: msg.loop } : {}),
  };

  try {
    const mixer = addChannelToMixer(model.mixer, msg.busTrackId, track);

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
        `An unknown error occurred while adding Track: ${JSON.stringify(error)}`,
      ),
    });
  }
};
