import type { Channel, Mixer } from './types';

/**
 * Map over all channels in the mixer, applying the provided function to each channel.
 *
 * @returns Updated Mixer with mapped channels
 */
export const map =
  (fn: (channel: Channel) => Channel) =>
  (mixer: Mixer): Mixer => {
    const mapChannels = (channels: Channel[]): Channel[] => {
      return channels.map((channel) => {
        const mappedChannel = fn(channel);
        if (mappedChannel.type === 'BusTrack') {
          return {
            ...mappedChannel,
            channels: mapChannels(mappedChannel.channels),
          };
        }
        return mappedChannel;
      });
    };

    return {
      ...mixer,
      channels: mapChannels(mixer.channels),
    };
  };
