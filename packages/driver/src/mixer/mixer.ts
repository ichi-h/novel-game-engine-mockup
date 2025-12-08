import type {
  ApplyMixer,
  BusTrack,
  Channel,
  Mixer,
  Track,
} from '@ichi-h/tsuzuri-core';

/**
 * Interface for managing audio channel state
 */
interface AudioChannelState {
  id: string;
  type: 'Track' | 'BusTrack';
  audioBuffer?: AudioBuffer;
  sourceNode?: AudioBufferSourceNode | undefined;
  gainNode: GainNode;
  playStartTime?: number | undefined;
  playStatus: 'Standby' | 'Playing' | 'Stopped';
}

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

/**
 * Class that realizes declaratively defined Mixer in the context of Web Audio API
 */
class MixerDriver {
  private audioContext: AudioContext;
  private masterGainNode: GainNode;
  private channelStates: Map<string, AudioChannelState> = new Map();

  constructor() {
    this.audioContext = new AudioContext();
    this.masterGainNode = this.audioContext.createGain();
    this.masterGainNode.connect(this.audioContext.destination);
  }

  /**
   * Compare current Mixer with new Mixer and apply differences
   */
  async apply(newMixer: Mixer): Promise<void> {
    // Update master volume
    this.updateMasterVolume(newMixer.volume);

    // Calculate and apply channel differences
    await this.updateChannels(newMixer.channels);
  }

  /**
   * Update master volume
   */
  private updateMasterVolume(volume: number): void {
    this.masterGainNode.gain.setValueAtTime(
      volume,
      this.audioContext.currentTime,
    );
  }

  /**
   * Apply channel list differences
   */
  private async updateChannels(newChannels: Channel[]): Promise<void> {
    const newChannelIds = new Set(newChannels.map((ch) => ch.id));
    const existingChannelIds = new Set(this.channelStates.keys());

    // Stop and remove deleted channels
    for (const id of existingChannelIds) {
      if (!newChannelIds.has(id)) {
        await this.removeChannel(id);
      }
    }

    // Process new or updated channels
    for (const channel of newChannels) {
      const existingState = this.channelStates.get(channel.id);

      if (!existingState) {
        await this.addChannel(channel);
      } else {
        await this.updateChannel(channel, existingState);
      }
    }
  }

  /**
   * Add new channel recursively
   */
  private async addChannel(
    channel: Channel,
    parentGainNode?: GainNode,
  ): Promise<void> {
    const targetGainNode = parentGainNode || this.masterGainNode;

    if (channel.type === 'Track') {
      await this.addTrack(channel, targetGainNode);
    } else {
      await this.addBusTrack(channel, targetGainNode);
    }
  }

  /**
   * Add Track channel
   */
  private async addTrack(
    track: Track,
    parentGainNode: GainNode,
  ): Promise<void> {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(track.volume, this.audioContext.currentTime);
    gainNode.connect(parentGainNode);

    const response = await fetch(track.src);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    const state: AudioChannelState = {
      id: track.id,
      type: 'Track',
      audioBuffer,
      gainNode,
      playStatus: track.playStatus,
    };

    this.channelStates.set(track.id, state);

    // Play only when playStatus is Playing
    if (track.playStatus === 'Playing') {
      await this.playTrack(track, state);
    }
  }

  /**
   * Add BusTrack channel
   */
  private async addBusTrack(
    busTrack: BusTrack,
    parentGainNode: GainNode,
  ): Promise<void> {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(
      busTrack.volume,
      this.audioContext.currentTime,
    );
    gainNode.connect(parentGainNode);

    const state: AudioChannelState = {
      id: busTrack.id,
      type: 'BusTrack',
      gainNode,
      playStatus: 'Playing',
    };

    this.channelStates.set(busTrack.id, state);

    for (const childChannel of busTrack.channels) {
      await this.addChannel(childChannel, gainNode);
    }
  }

  /**
   * Play Track
   */
  private async playTrack(
    track: Track,
    state: AudioChannelState,
  ): Promise<void> {
    if (!state.audioBuffer) return;

    if (state.sourceNode) {
      state.sourceNode.stop();
      state.sourceNode.disconnect();
    }

    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = state.audioBuffer;
    sourceNode.connect(state.gainNode);

    if (track.isLoop) {
      sourceNode.loop = true;
      sourceNode.loopStart = track.isLoop.start;
      sourceNode.loopEnd = track.isLoop.end;
    }

    const startTime =
      this.audioContext.currentTime + (track.delayMs || 0) / 1000;
    const offset = (track.offsetMs || 0) / 1000;

    // Fade-in processing
    if (track.fadeInMs) {
      fadeIn(state.gainNode, track.volume, startTime, track.fadeInMs);
    } else {
      state.gainNode.gain.setValueAtTime(track.volume, startTime);
    }

    sourceNode.start(startTime, offset);

    state.sourceNode = sourceNode;
    state.playStartTime = startTime;
    state.playStatus = 'Playing';

    // Fade-out processing (when audio ends naturally)
    if (track.fadeOutMs && state.audioBuffer.duration && !track.isLoop) {
      const fadeOutStartTime =
        startTime +
        state.audioBuffer.duration -
        offset -
        track.fadeOutMs / 1000;
      fadeOut(state.gainNode, track.volume, fadeOutStartTime, track.fadeOutMs);
    }
  }

  /**
   * Update existing channel
   */
  private async updateChannel(
    channel: Channel,
    state: AudioChannelState,
  ): Promise<void> {
    if (channel.type === 'Track') {
      await this.updateTrack(channel, state);
    } else {
      await this.updateBusTrack(channel, state);
    }
  }

  /**
   * Update Track
   */
  private async updateTrack(
    track: Track,
    state: AudioChannelState,
  ): Promise<void> {
    if (state.gainNode.gain.value !== track.volume) {
      state.gainNode.gain.setValueAtTime(
        track.volume,
        this.audioContext.currentTime,
      );
    }

    if (state.playStatus !== track.playStatus) {
      switch (track.playStatus) {
        case 'Playing':
          // Start playing from Standby state
          if (state.playStatus === 'Standby') {
            await this.playTrack(track, state);
          }
          break;
        case 'Stopped':
          // Stop from Playing state with fade-out
          this.stopTrack(state, track.fadeOutMs);
          break;
      }
    }
  }

  /**
   * Stop Track
   */
  private stopTrack(state: AudioChannelState, fadeOutMs?: number): void {
    if (state.sourceNode) {
      const currentTime = this.audioContext.currentTime;
      const currentVolume = state.gainNode.gain.value;

      if (fadeOutMs && fadeOutMs > 0) {
        // Apply fade-out before stopping
        fadeOut(state.gainNode, currentVolume, currentTime, fadeOutMs);
        // Schedule stop after fade-out completes
        setTimeout(() => {
          if (state.sourceNode) {
            state.sourceNode.stop();
            state.sourceNode.disconnect();
            state.sourceNode = undefined;
          }
        }, fadeOutMs);
      } else {
        // Stop immediately without fade-out
        state.sourceNode.stop();
        state.sourceNode.disconnect();
        state.sourceNode = undefined;
      }
    }
    state.playStartTime = undefined;
    state.playStatus = 'Stopped';
  }

  /**
   * Update BusTrack
   */
  private async updateBusTrack(
    busTrack: BusTrack,
    state: AudioChannelState,
  ): Promise<void> {
    // ボリュームの更新
    if (state.gainNode.gain.value !== busTrack.volume) {
      state.gainNode.gain.setValueAtTime(
        busTrack.volume,
        this.audioContext.currentTime,
      );
    }

    // Apply child channel differences
    const newChildIds = new Set(busTrack.channels.map((ch: Channel) => ch.id));
    const existingChildIds = new Set(
      busTrack.channels
        .map((ch: Channel) => ch.id)
        .filter((id: string) => this.channelStates.has(id)),
    );

    // Remove deleted child channels
    for (const id of existingChildIds) {
      if (!newChildIds.has(id)) {
        await this.removeChannel(id);
      }
    }

    // Process new or updated child channels
    for (const childChannel of busTrack.channels) {
      const childState = this.channelStates.get(childChannel.id);

      if (!childState) {
        await this.addChannel(childChannel, state.gainNode);
      } else {
        await this.updateChannel(childChannel, childState);
      }
    }
  }

  /**
   * Remove channel
   */
  private async removeChannel(id: string): Promise<void> {
    const state = this.channelStates.get(id);
    if (!state) return;

    // Stop if playing
    if (state.sourceNode) {
      state.sourceNode.stop();
      state.sourceNode.disconnect();
    }

    // Disconnect GainNode
    state.gainNode.disconnect();

    this.channelStates.delete(id);
  }

  /**
   * Resume AudioContext (required after user interaction)
   */
  async resumeContext(): Promise<void> {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    for (const id of this.channelStates.keys()) {
      await this.removeChannel(id);
    }
  }
}

// Singleton instance
let mixerInstance: MixerDriver | null = null;

/**
 * Implementation of ApplyMixer function
 * Realizes state using Web Audio API based on declarative Mixer definition
 */
export const createApplyMixer = (): ApplyMixer => {
  if (!mixerInstance) {
    mixerInstance = new MixerDriver();
  }

  return async (mixer: Mixer) => {
    await mixerInstance?.apply(mixer);
  };
};

/**
 * Resume AudioContext (for browser autoplay policy compliance)
 */
export const resumeAudioContext = async (): Promise<void> => {
  if (mixerInstance) {
    await mixerInstance.resumeContext();
  }
};

/**
 * Cleanup resources
 */
export const cleanupMixer = async (): Promise<void> => {
  if (mixerInstance) {
    await mixerInstance.cleanup();
  }
};
