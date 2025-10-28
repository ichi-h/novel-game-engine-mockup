import { hasId } from './has-id';
import type { Channel, Mixer } from './types';

/**
 * Add a new channel to the mixer, either at the top level or within a specified parent BusTrack
 *
 * @returns Updated Mixer with the new channel added
 * @throws Error if a channel with the same ID already exists in the mixer
 * @throws Error if the specified parent BusTrack does not exist in the mixer
 */
export const addChannel = (
  mixer: Mixer,
  newChannel: Channel,
  parentBusTrackId: string | undefined,
): Mixer => {
  if (hasId(mixer, newChannel.id)) {
    throw new Error(`Channel with ID ${newChannel.id} already exists in mixer`);
  }

  if (parentBusTrackId !== undefined && !hasId(mixer, parentBusTrackId)) {
    throw new Error(
      `Parent BusTrack with ID ${parentBusTrackId} does not exist in mixer`,
    );
  }

  const channels = addToChannels(mixer.channels, newChannel, parentBusTrackId);
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
  newChannel: Channel,
  parentBusTrackId: string | undefined,
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
      channels: addToChannels(channel.channels, newChannel, parentBusTrackId),
    };
  });
};
