import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface RemoveChannelMessage extends BaseMessage {
  type: 'RemoveChannel';
  name: string;
}

export const removeChannel = (name: string): RemoveChannelMessage => {
  return {
    type: 'RemoveChannel',
    name,
  };
};

export const handleRemoveChannel = <Component>(
  model: NovelModel<Component>,
  msg: RemoveChannelMessage,
): ReturnModel<NovelModel<Component>, never> => {
  model.mixer.removeChannel(msg.name);
  return model;
};
