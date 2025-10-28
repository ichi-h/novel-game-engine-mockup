import type { BaseMessage, ReturnModel, Update } from 'elmish';
import { type ApplyMixer, filter, hasId } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { createApplyMixerCommand } from './utils';

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

export const handleRemoveChannel = <Component>(
  model: NovelModel<Component>,
  msg: RemoveChannelMessage,
  update: Update<NovelModel<Component>, NovelMessage<Component>>,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  if (!hasId(model.mixer, msg.channelId)) {
    return update(model, {
      type: 'Error',
      value: new Error(
        `Channel with ID ${msg.channelId} does not exist in the mixer.`,
      ),
    });
  }

  const mixer = filter((c) => c.id !== msg.channelId)(model.mixer);

  return [
    {
      ...model,
      mixer,
      isApplyingMixer: true,
    },
    createApplyMixerCommand(mixer, applyMixer),
  ];
};
