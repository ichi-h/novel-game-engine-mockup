export type FadeInMs = number;
export type FadeOutMs = number;
export type DelayMs = number;
export type OffsetMs = number;
export type Volume = number;
export type Samples = number;

export interface IMixer {
  changeMasterVolume(volume: Volume): void;
  addChannel(
    name: string,
    source: ArrayBuffer,
    volume?: Volume,
    isLoop?: boolean,
    loopStart?: Samples,
    loopEnd?: Samples,
  ): Promise<void>;
  removeChannel(name: string): string;
  playChannel(
    name: string,
    delayMs?: DelayMs,
    offsetMs?: OffsetMs,
    fadeInMs?: FadeInMs,
    fadeOutMs?: FadeOutMs,
  ): string;
  stopChannel(name: string, fadeOutMs?: FadeOutMs): string;
  pauseChannel(name: string, fadeOutMs?: FadeOutMs): string;
  resumeChannel(name: string, fadeInMs?: FadeInMs): string;
  changeChannelVolume(name: string, volume: Volume): string;
}
