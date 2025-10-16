import type { BaseMessage, ReturnModel } from 'elmish';
import type { FadeInMs } from '../../mixer';
import type { NovelModel } from '../../model';

export interface ResumeSoundMessage extends BaseMessage {
  type: 'ResumeSound';
  channelName: string;
  fadeInMs?: FadeInMs;
}

export const handleResumeSound = (
  model: NovelModel,
  msg: ResumeSoundMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
