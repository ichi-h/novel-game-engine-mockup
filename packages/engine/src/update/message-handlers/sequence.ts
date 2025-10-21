import type { BaseMessage, Cmd, ReturnModel, Update } from 'elmish';
import type { NovelModel } from '@/model';

export interface SequenceMessage<T extends BaseMessage> extends BaseMessage {
  type: 'Sequence';
  messages: T[];
}

export const handleSequence = <T extends BaseMessage>(
  model: NovelModel,
  msg: SequenceMessage<T>,
  update: Update<NovelModel, T>,
): ReturnModel<NovelModel, SequenceMessage<T>> => {
  const result = msg.messages.reduce<{
    model: NovelModel;
    cmds: Cmd<T>[];
  }>(
    (acc, cur) => {
      const result = update(acc.model, cur);
      const [nextModel, nextCmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      return {
        model: nextModel,
        cmds: [
          ...acc.cmds,
          ...(nextCmd ? (Array.isArray(nextCmd) ? nextCmd : [nextCmd]) : []),
        ],
      };
    },
    { model, cmds: [] },
  );

  return [
    result.model,
    async () => {
      const results = await Promise.all(result.cmds.map((cmd) => cmd()));
      const msg: SequenceMessage<T> = {
        type: 'Sequence',
        messages: results,
      };
      return msg;
    },
  ];
};
