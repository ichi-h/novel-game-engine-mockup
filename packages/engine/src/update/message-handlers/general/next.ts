import type { ReturnModel, Update } from 'elmish';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';

export type NextMessage<CustomState = unknown> = {
  type: 'Next';
  message: NovelMessage<CustomState>;
};

export const handleNext = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: NextMessage<CustomState>,
  update: Update<NovelModel<CustomState>, NovelMessage<CustomState>>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
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
