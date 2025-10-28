import type { Channel, Mixer } from './types';

/**
 * Check if a channel with the specified ID exists in the mixer
 */
export const hasId = (mixer: Mixer, channelId: string): boolean => {
  return hasIdInChannels(mixer.channels, channelId);
};

/**
 * Recursively check if a channel with the specified ID exists in the channels array
 */
const hasIdInChannels = (channels: Channel[], channelId: string): boolean => {
  for (const channel of channels) {
    if (channel.id === channelId) {
      return true;
    }
    if (channel.type === 'BusTrack') {
      if (hasIdInChannels(channel.channels, channelId)) {
        return true;
      }
    }
  }
  return false;
};
