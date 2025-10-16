import type {
  DelayMs,
  FadeInMs,
  FadeOutMs,
  IMixer,
  OffsetMs,
  Samples,
  Volume,
} from '../mixer';

const channelNotFound = (name: string) => `Channel "${name}" not found`;

const fadeIn = (
  gainNode: GainNode,
  targetVolume: number,
  startTime: number,
  fadeInMs: number,
) => {
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(
    targetVolume,
    startTime + fadeInMs / 1000,
  );
};

const fadeOut = (
  gainNode: GainNode,
  currentVolume: number,
  startTime: number,
  fadeOutMs: number,
) => {
  gainNode.gain.cancelScheduledValues(startTime);
  gainNode.gain.setValueAtTime(currentVolume, startTime);
  gainNode.gain.linearRampToValueAtTime(0, startTime + fadeOutMs / 1000);
};

export class Mixer implements IMixer {
  private _name: string;
  private channels: Map<
    string,
    {
      ctx: AudioContext;
      sourceNode: AudioBufferSourceNode;
      gainNode: GainNode;
      playStatus: 'Playing' | 'Paused' | 'Standby';
      volume: number;
    }
  >;
  private _masterVolume: Volume;

  constructor(name: string) {
    this._name = name;
    this.channels = new Map();
    this._masterVolume = 1.0;
  }

  public get name(): string {
    return this._name;
  }

  public get masterVolume(): Volume {
    return this._masterVolume;
  }

  changeMasterVolume(volume: Volume) {
    this._masterVolume = volume;
    this.channels.forEach((channel) => {
      channel.gainNode.gain.setValueAtTime(
        channel.volume * this._masterVolume,
        0,
      );
    });
  }

  async addChannel(
    name: string,
    source: ArrayBuffer,
    volume: Volume = 1.0,
    isLoop: boolean = false,
    loopStart: Samples = 0,
    loopEnd: Samples = 0,
  ) {
    const channel = this.channels.get(name);
    if (channel !== undefined) {
      channel.sourceNode.stop();
      channel.sourceNode.disconnect();
      channel.gainNode.disconnect();
      channel.ctx.close();
    }

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const sourceNode = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    const decodedData = await ctx.decodeAudioData(source);
    const sampleRate = decodedData.sampleRate;
    sourceNode.buffer = decodedData;
    sourceNode.loop = isLoop;
    sourceNode.loopStart = loopStart / sampleRate;
    sourceNode.loopEnd = loopEnd / sampleRate;

    sourceNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    this.channels.set(name, {
      ctx,
      sourceNode,
      gainNode,
      playStatus: 'Standby',
      volume,
    });
  }

  removeChannel(name: string) {
    const channel = this.channels.get(name);
    if (channel === undefined) {
      return channelNotFound(name);
    }

    channel.sourceNode.stop();
    channel.sourceNode.disconnect();
    channel.gainNode.disconnect();
    channel.ctx.close();
    this.channels.delete(name);
    return '';
  }

  playChannel(
    name: string,
    delayMs: DelayMs = 0,
    offsetMs: OffsetMs = 0,
    fadeInMs: FadeInMs = 0,
    fadeOutMs: FadeOutMs = 0,
  ) {
    const channel = this.channels.get(name);
    if (channel === undefined) {
      return channelNotFound(name);
    }

    const { sourceNode, gainNode, volume } = channel;

    try {
      sourceNode.start(delayMs / 1000, offsetMs / 1000);
    } catch (error) {
      if (error instanceof Error) return error.message;
      return String(error);
    }
    fadeIn(gainNode, volume * this._masterVolume, 0, fadeInMs);

    if (!sourceNode.loop && sourceNode.buffer !== null) {
      const duration = sourceNode.buffer.duration;
      fadeOut(
        gainNode,
        volume * this._masterVolume,
        duration - fadeOutMs / 1000,
        fadeOutMs,
      );
    }

    return '';
  }

  stopChannel(name: string, fadeOutMs: FadeOutMs = 0) {
    const channel = this.channels.get(name);
    if (channel === undefined) {
      return channelNotFound(name);
    }

    const {
      ctx: { currentTime },
      sourceNode,
      gainNode,
      volume,
    } = channel;

    fadeOut(gainNode, volume * this._masterVolume, currentTime, fadeOutMs);
    setTimeout(() => sourceNode.stop(), fadeOutMs);

    return '';
  }

  pauseChannel(name: string, fadeOutMs: FadeOutMs = 0) {
    const channel = this.channels.get(name);
    if (channel === undefined) {
      return channelNotFound(name);
    }

    const { ctx, gainNode, volume } = channel;
    const { currentTime } = ctx;

    fadeOut(gainNode, volume * this._masterVolume, currentTime, fadeOutMs);
    setTimeout(() => ctx.suspend(), fadeOutMs);

    return '';
  }

  resumeChannel(name: string, fadeInMs: FadeInMs = 0) {
    const channel = this.channels.get(name);
    if (channel === undefined) {
      return channelNotFound(name);
    }

    const { ctx, gainNode, volume } = channel;
    const { currentTime } = ctx;

    ctx.resume();
    fadeIn(gainNode, volume * this._masterVolume, currentTime, fadeInMs);
    return '';
  }

  changeChannelVolume(name: string, volume: Volume) {
    const channel = this.channels.get(name);
    if (channel === undefined) {
      return channelNotFound(name);
    }

    const { gainNode } = channel;
    gainNode.gain.setValueAtTime(volume * this._masterVolume, 0);
    this.channels.set(name, { ...channel, volume });
    return '';
  }
}
