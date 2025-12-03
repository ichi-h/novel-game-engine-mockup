import type { ReturnModel, Update } from 'elmish';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export type NextMessage = {
  type: 'Next';
  message: NovelMessage;
};

export const handleNext = (
  model: NovelModel,
  msg: NextMessage,
  update: Update<NovelModel, NovelMessage>,
): ReturnModel<NovelModel, NovelMessage> => {
  const result = update(model, msg.message);

  const [newModel, cmd] = Array.isArray(result)
    ? [result[0], result[1]]
    : [result, undefined];

  return [
    {
      ...newModel,
      index: newModel.index + 1,
    },
    cmd,
  ];
};
