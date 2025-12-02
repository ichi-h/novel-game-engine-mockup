import type { BaseMessage, ReturnModel, Update } from 'elmish';
import { filter, hasId } from '@/mixer';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export interface RemoveChannelMessage extends BaseMessage {
  type: 'RemoveChannel';
  channelId: string;
}

export const removeChannel = (channelId: string): RemoveChannelMessage => {
  return {
    type: 'RemoveChannel',
    channelId,
  };
};

export const handleRemoveChannel = (
  model: NovelModel,
  msg: RemoveChannelMessage,
  update: Update<NovelModel, NovelMessage>,
): ReturnModel<NovelModel, NovelMessage> => {
  if (!hasId(model.mixer, msg.channelId)) {
    return update(model, {
      type: 'Error',
      value: new Error(
        `Channel with ID ${msg.channelId} does not exist in the mixer.`,
      ),
    });
  }

  const mixer = filter((c) => c.id !== msg.channelId)(model.mixer);

  return update(
    {
      ...model,
      mixer,
    },
    {
      type: 'ApplyMixer',
    },
  );
};
