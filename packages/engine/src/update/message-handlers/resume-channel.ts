import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeInMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface ResumeChannelMessage extends BaseMessage {
  type: 'ResumeChannel';
  channelName: string;
  fadeInMs?: FadeInMs;
}

export const handleResumeChannel = (
  model: NovelModel,
  msg: ResumeChannelMessage,
): ReturnModel<NovelModel, never> => {
  model.mixer.resumeChannel(msg.channelName, msg.fadeInMs);
  return model;
};
