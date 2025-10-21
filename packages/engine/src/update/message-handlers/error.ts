import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface ErrorMessage extends BaseMessage {
  type: 'Error';
  value: Error;
}

export interface RecoverErrorMessage extends BaseMessage {
  type: 'RecoverError';
}

export const handleError = (
  model: NovelModel,
  msg: ErrorMessage,
): ReturnModel<NovelModel, never> => {
  return {
    ...model,
    error: msg.value,
  };
};

export const handleRecoverError = (
  model: NovelModel,
): ReturnModel<NovelModel, never> => {
  return {
    ...model,
    error: null,
  };
};
