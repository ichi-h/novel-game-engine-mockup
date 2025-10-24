export interface Track {
  id: string;
  type: 'Track';
  playStatus: 'Standby' | 'Playing' | 'Stopped';
  volume: number;
  isLoop?: {
    start: number;
    end: number;
  };
  source: ArrayBuffer;
  fadeInMs?: number;
  fadeOutMs?: number;
  delayMs?: number;
  offsetMs?: number;
}

export interface BusTrack {
  id: string;
  type: 'BusTrack';
  volume: number;
  channels: Channel[];
}

export type Channel = Track | BusTrack;

export interface Mixer {
  volume: number;
  channels: Channel[];
}

export type ApplyMixer = (mixer: Mixer) => Promise<void>;
