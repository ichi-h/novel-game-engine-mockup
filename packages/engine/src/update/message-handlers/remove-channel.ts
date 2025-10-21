import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface RemoveChannelMessage extends BaseMessage {
  type: 'RemoveChannel';
  name: string;
}

export const handleRemoveChannel = (
  model: NovelModel,
  msg: RemoveChannelMessage,
): ReturnModel<NovelModel, never> => {
  model.mixer.removeChannel(msg.name);
  return model;
};
