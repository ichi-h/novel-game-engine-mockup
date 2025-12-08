export type FadeInMs = number;
export type FadeOutMs = number;
export type DelayMs = number;
export type OffsetMs = number;
export type Volume = number;
export type Samples = number;

export interface Track {
  id: string;
  type: 'Track';
  playStatus: 'Standby' | 'Playing' | 'Stopped';
  volume: Volume;
  isLoop?: {
    start: Samples;
    end: Samples;
  };
  src: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  offsetMs?: OffsetMs;
}

export interface BusTrack {
  id: string;
  type: 'BusTrack';
  volume: Volume;
  channels: Channel[];
}

export type Channel = Track | BusTrack;

export interface Mixer {
  volume: Volume;
  channels: Channel[];
}

export type ApplyMixer = (mixer: Mixer) => Promise<void>;
