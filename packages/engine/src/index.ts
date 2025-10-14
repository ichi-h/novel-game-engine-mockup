type FadeInMs = number;
type FadeOutMs = number;
type DelayMs = number;
type Volume = number;
type Samples = number;

interface Channel {
  name: string;
  playStatus: 'playing' | 'paused' | 'stopped';
  volume: Volume;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

interface Mixer {
  name: string;
  channels: Channel[];
  masterVolume: Volume;
}

// ---

interface Event {
  type: string;
}

interface AddLayerObjectEvent extends Event {
  type: 'AddLayerObject';
  id: string;
  style?: string;
}

interface ShowImageObjectEvent extends Event {
  type: 'ShowImageObject';
  id?: string;
  layerId: string;
  src: string;
}

interface AddMessageBoxObjectEvent extends Event {
  type: 'AddMessageBoxObject';
  id: string;
  layerId: string;
  style?: string;
}

interface ShowTextObjectEvent extends Event {
  type: 'ShowTextObject';
  id?: string;
  messageBoxId: string;
  content: string;
  turnImmediately?: boolean;
  clearOnNext?: boolean;
}

interface RemoveObjectsEvent extends Event {
  type: 'RemoveObjects';
  ids: string[];
}

interface WaitForUserEvent extends Event {
  type: 'WaitForUser';
}

interface DelayEvent extends Event {
  type: 'Delay';
  durationMs: number;
}

interface CreateMixerEvent extends Event {
  type: 'CreateMixer';
  masterVolume?: Volume;
}

interface RemoveMixerEvent extends Event {
  type: 'RemoveMixer';
  name: string;
}

interface ChangeMixerMasterVolumeEvent extends Event {
  type: 'ChangeMixerMasterVolume';
  name: string;
  masterVolume: Volume;
}

interface CreateChannelEvent extends Event {
  type: 'CreateChannel';
  name: string;
  mixerName: string;
  volume?: Volume;
}

interface RemoveChannelEvent extends Event {
  type: 'RemoveChannel';
  name: string;
}

interface ChangeChannelVolumeEvent extends Event {
  type: 'ChangeChannelVolume';
  channelName: string;
  volume: Volume;
}

interface PlaySoundEvent extends Event {
  type: 'PlaySound';
  channelName: string;
  src: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

interface StopSoundEvent extends Event {
  type: 'StopSound';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

interface PauseSoundEvent extends Event {
  type: 'PauseSound';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

interface ResumeSoundEvent extends Event {
  type: 'ResumeSound';
  channelName: string;
  fadeInMs?: FadeInMs;
}

type NovelEvent =
  | AddLayerObjectEvent
  | ShowImageObjectEvent
  | AddMessageBoxObjectEvent
  | ShowTextObjectEvent
  | RemoveObjectsEvent
  | WaitForUserEvent
  | DelayEvent
  | CreateMixerEvent
  | RemoveMixerEvent
  | ChangeMixerMasterVolumeEvent
  | CreateChannelEvent
  | RemoveChannelEvent
  | ChangeChannelVolumeEvent
  | PlaySoundEvent
  | StopSoundEvent
  | PauseSoundEvent
  | ResumeSoundEvent;
