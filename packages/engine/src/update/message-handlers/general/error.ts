import type { BaseMessage, ReturnModel } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';

export interface ErrorMessage extends BaseMessage {
  type: 'Error';
  value: Error;
}

export interface RecoverErrorMessage extends BaseMessage {
  type: 'RecoverError';
}

export const error = (value: Error): ErrorMessage => {
  return {
    type: 'Error',
    value,
  };
};

export const handleError = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: ErrorMessage,
): ReturnModel<NovelModel<CustomState>, never> => {
  return {
    ...model,
    status: { value: 'Error', error: msg.value },
  };
};

export const handleRecoverError = <CustomState = unknown>(
  model: NovelModel<CustomState>,
): ReturnModel<NovelModel<CustomState>, never> => {
  return {
    ...model,
    status: { value: 'Processed' },
  };
};
