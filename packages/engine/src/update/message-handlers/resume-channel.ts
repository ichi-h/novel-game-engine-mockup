import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeInMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface ResumeChannelMessage extends BaseMessage {
  type: 'ResumeChannel';
  channelName: string;
  fadeInMs?: FadeInMs;
}

export const resumeChannel = (
  channelName: string,
  fadeInMs?: FadeInMs,
): ResumeChannelMessage => {
  return {
    type: 'ResumeChannel',
    channelName,
    ...(fadeInMs !== undefined ? { fadeInMs } : {}),
  };
};

export const handleResumeChannel = <Component>(
  model: NovelModel<Component>,
  msg: ResumeChannelMessage,
): ReturnModel<NovelModel<Component>, never> => {
  model.mixer.resumeChannel(msg.channelName, msg.fadeInMs);
  return model;
};
