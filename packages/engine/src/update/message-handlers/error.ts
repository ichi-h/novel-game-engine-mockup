import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface ErrorMessage extends BaseMessage {
  type: 'Error';
  value: Error;
}

export interface RecoverErrorMessage extends BaseMessage {
  type: 'RecoverError';
}

export const handleError = <Component>(
  model: NovelModel<Component>,
  msg: ErrorMessage,
): ReturnModel<NovelModel<Component>, never> => {
  return {
    ...model,
    error: msg.value,
  };
};

export const handleRecoverError = <Component>(
  model: NovelModel<Component>,
): ReturnModel<NovelModel<Component>, never> => {
  return {
    ...model,
    error: null,
  };
};
