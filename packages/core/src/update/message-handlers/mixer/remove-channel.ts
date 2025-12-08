import type { BaseMessage, ReturnModel, Update } from '@ichi-h/elmish';
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

export const handleRemoveChannel = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: RemoveChannelMessage,
  update: Update<NovelModel<CustomState>, NovelMessage<CustomState>>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
  if (!hasId(model.mixer.value, msg.channelId)) {
    return update(model, {
      type: 'Error',
      value: new Error(
        `Channel with ID ${msg.channelId} does not exist in the mixer.`,
      ),
    });
  }

  const mixer = filter((c) => c.id !== msg.channelId)(model.mixer.value);

  return update(
    {
      ...model,
      mixer: {
        ...model.mixer,
        value: mixer,
      },
    },
    {
      type: 'ApplyMixer',
    },
  );
};
