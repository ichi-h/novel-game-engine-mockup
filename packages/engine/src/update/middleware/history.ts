import type { ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';
import type { NovelMessage } from '../message';
import type { MiddlewareNext } from './types';

export const historyMiddleware = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: NovelMessage<CustomState>,
  next: MiddlewareNext<CustomState>,
): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
  const result = next(model, msg);

  const [newModel, cmd] = Array.isArray(result)
    ? [result[0], result[1]]
    : [result, undefined];

  const messageType = msg.type;
  const currentHistory = newModel.history[messageType];
  const updatedHistory = [...currentHistory, msg];
  const historyLength = newModel.config.historyLength[messageType];

  const trimmedHistory =
    historyLength === 0
      ? []
      : updatedHistory.length > historyLength
        ? updatedHistory.slice(-historyLength)
        : updatedHistory;

  return [
    {
      ...newModel,
      history: {
        ...newModel.history,
        [messageType]: trimmedHistory,
      },
    },
    cmd,
  ];
};
