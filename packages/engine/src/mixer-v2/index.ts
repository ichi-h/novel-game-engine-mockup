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

/**
 * Check if a channel with the specified ID exists in the mixer
 */
export const hasIdInMixer = (mixer: Mixer, channelId: string): boolean => {
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

/**
 * Add a new channel to the mixer, either at the top level or within a specified parent BusTrack
 *
 * @returns Updated Mixer with the new channel added
 * @throws Error if a channel with the same ID already exists in the mixer
 * @throws Error if the specified parent BusTrack does not exist in the mixer
 */
export const addChannelToMixer = (
  mixer: Mixer,
  newChannel: Channel,
  parentBusTrackId: string | undefined,
): Mixer => {
  if (hasIdInChannels(mixer.channels, newChannel.id)) {
    throw new Error(`Channel with ID ${newChannel.id} already exists in mixer`);
  }

  if (
    parentBusTrackId !== undefined &&
    !hasIdInChannels(mixer.channels, parentBusTrackId)
  ) {
    throw new Error(
      `Parent BusTrack with ID ${parentBusTrackId} does not exist in mixer`,
    );
  }

  const channels = addToChannels(mixer.channels, parentBusTrackId, newChannel);
  return {
    ...mixer,
    channels,
  };
};

/**
 * Recursively add a new channel to the channels array, either at the top level or within a specified parent BusTrack
 *
 * @returns Updated channels array with the new channel added
 */
const addToChannels = (
  channels: Channel[],
  parentBusTrackId: string | undefined,
  newChannel: Channel,
): Channel[] => {
  if (parentBusTrackId === undefined) {
    return [...channels, newChannel];
  }

  return channels.map((channel) => {
    if (channel.type !== 'BusTrack') return channel;

    if (channel.id === parentBusTrackId) {
      return {
        ...channel,
        channels: [...channel.channels, newChannel],
      };
    }

    return {
      ...channel,
      channels: addToChannels(channel.channels, parentBusTrackId, newChannel),
    };
  });
};

/**
 * Map over all channels in the mixer, applying the provided function to each channel.
 *
 * @returns Updated Mixer with mapped channels
 */
export const mapMixer =
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

export const filterMixer =
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
