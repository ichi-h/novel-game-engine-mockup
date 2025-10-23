import type { BaseMessage, ReturnModel } from 'elmish';
import type { DelayMs, FadeInMs, FadeOutMs, OffsetMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface PlayChannelMessage extends BaseMessage {
  type: 'PlayChannel';
  channelName: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  offsetMs?: OffsetMs;
}

export const handlePlayChannel = <Component>(
  model: NovelModel<Component>,
  msg: PlayChannelMessage,
): ReturnModel<NovelModel<Component>, never> => {
  model.mixer.playChannel(
    msg.channelName,
    msg.delayMs,
    msg.offsetMs,
    msg.fadeInMs,
    msg.fadeOutMs,
  );
  return model;
};
