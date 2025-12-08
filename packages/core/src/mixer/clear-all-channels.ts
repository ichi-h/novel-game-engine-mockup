import type { Mixer } from './types';

/**
 * Clear all channels from the mixer
 */
export const clearAllChannels = (mixer: Mixer): Mixer => {
  return {
    ...mixer,
    channels: [],
  };
};
