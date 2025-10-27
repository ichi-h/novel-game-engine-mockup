import type { BaseMessage, ReturnModel } from 'elmish';
import type { ApplyMixer, Samples, Track, Volume } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '../message';
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

  const channels = [...model.mixer.channels, track];

  const mixer = {
    ...model.mixer,
    channels,
  };

  return [
    {
      ...model,
      mixer,
      isApplyingMixer: true,
    },
    createApplyMixerCommand(mixer, applyMixer),
  ];
};
