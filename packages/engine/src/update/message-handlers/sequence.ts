import type { BaseMessage, Cmd, ReturnModel, Update } from 'elmish';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '../message';

export interface SequenceMessage<Message extends BaseMessage>
  extends BaseMessage {
  type: 'Sequence';
  messages: Message[];
}

export const sequence = <Message extends BaseMessage>(
  messages: Message[],
): SequenceMessage<Message> => {
  return {
    type: 'Sequence',
    messages,
  };
};

export const handleSequence = <Component>(
  model: NovelModel<Component>,
  msg: SequenceMessage<NovelMessage<Component>>,
  update: Update<NovelModel<Component>, NovelMessage<Component>>,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  if (msg.messages.length === 0) {
    return model;
  }

  const messages: NovelMessage<Component>[] = [];
  const restMessages: NovelMessage<Component>[] = [];
  const delayIndex = msg.messages.findIndex((m) => m.type === 'Delay');

  if (delayIndex !== -1) {
    messages.push(...msg.messages.slice(0, delayIndex + 1));
    restMessages.push(...msg.messages.slice(delayIndex + 1));
  } else {
    messages.push(...msg.messages);
  }

  const result = messages.reduce<{
    model: NovelModel<Component>;
    cmds: Cmd<NovelMessage<Component>>[];
  }>(
    (acc, cur) => {
      const updateResult = update(acc.model, cur);
      const [nextModel, nextCmd] = Array.isArray(updateResult)
        ? updateResult
        : [updateResult, undefined];
      return {
        model: nextModel,
        cmds: [...acc.cmds, ...(nextCmd ? [nextCmd] : [])],
      };
    },
    { model, cmds: [] },
  );

  return [
    result.model,
    async () => {
      const cmdMsgs = await Promise.all(result.cmds.map((cmd) => cmd()));
      const msg: SequenceMessage<NovelMessage<Component>> = {
        type: 'Sequence',
        messages: [...restMessages, ...cmdMsgs],
      };
      return msg;
    },
  ];
};
