import type { NovelMessage } from '@ichi-h/tsuzuri-core';
import { addTrack, playChannel, sequence } from '@ichi-h/tsuzuri-core';
import { AUDIO_BUS_IDS } from '../../constants/audio';

/**
 * Create a message sequence to play a sound effect
 * This creates a track and immediately plays it on the SE bus
 *
 * @param src - Path to the SE audio file
 * @param volume - Volume level (0.0 to 1.0), defaults to 1.0
 * @returns A sequence message containing track creation and playback
 */
export const playSE = (src: string, volume?: number): NovelMessage => {
  const id = crypto.randomUUID();
  return sequence([
    addTrack({
      id,
      src,
      busTrackId: AUDIO_BUS_IDS.SE,
      volume,
    }),
    playChannel({ channelId: id }),
  ]);
};
