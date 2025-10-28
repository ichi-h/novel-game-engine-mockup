import type { Channel, Mixer } from './types';

/**
 * Filter channels in the mixer based on the provided predicate function.
 *
 * @returns Updated Mixer with filtered channels
 */
export const filter =
  (predicate: (channel: Channel) => boolean) =>
  (mixer: Mixer): Mixer => {
    const filterChannels = (channels: Channel[]): Channel[] => {
      return channels
        .map((channel) => {
          if (channel.type === 'BusTrack') {
            return {
              ...channel,
              channels: filterChannels(channel.channels),
            };
          }
          return channel;
        })
        .filter(predicate);
    };

    return {
      ...mixer,
      channels: filterChannels(mixer.channels),
    };
  };
