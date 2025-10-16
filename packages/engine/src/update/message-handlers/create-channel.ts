import type { BaseMessage, ReturnModel } from 'elmish';
import type { Samples, Volume } from '../../mixer';
import type { NovelModel } from '../../model';

export interface CreateChannelMessage extends BaseMessage {
  type: 'CreateChannel';
  name: string;
  src: string;
  volume?: Volume;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

export const handleCreateChannel = (
  model: NovelModel,
  msg: CreateChannelMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
