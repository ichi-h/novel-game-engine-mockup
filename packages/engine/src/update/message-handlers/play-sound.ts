import type { BaseMessage, ReturnModel } from 'elmish';
import type { DelayMs, FadeInMs, FadeOutMs, OffsetMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface PlaySoundMessage extends BaseMessage {
  type: 'PlaySound';
  channelName: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  offsetMs?: OffsetMs;
}

export const handlePlaySound = (
  model: NovelModel,
  msg: PlaySoundMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
