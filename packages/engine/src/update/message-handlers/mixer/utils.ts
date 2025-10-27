import type { Cmd } from 'elmish';
import type { ApplyMixer, Mixer } from '@/mixer-v2';
import type { NovelMessage } from '@/update/message';

/**
 * Create a command that applies mixer changes and dispatches ApplyMixerCompleted message.
 */
export const createApplyMixerCommand = <Component>(
  updatedMixer: Mixer,
  applyMixer: ApplyMixer,
): Cmd<NovelMessage<Component>> => {
  return async () => {
    let error: Error | null = null;
    try {
      await applyMixer(updatedMixer);
    } catch (e) {
      error = e instanceof Error ? e : new Error(String(e));
    }
    return {
      type: 'ApplyMixerCompleted',
      error,
    };
  };
};
