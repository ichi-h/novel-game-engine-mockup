import type { BaseMessage } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';

export interface PutModelMessage<CustomState = unknown> extends BaseMessage {
  type: 'PutModel';
  model: NovelModel<CustomState>;
}

export const putModel = <CustomState = unknown>(
  model: NovelModel<CustomState>,
): PutModelMessage<CustomState> => {
  return {
    type: 'PutModel',
    model,
  };
};

export const handlePutModel = <CustomState = unknown>(
  _model: NovelModel<CustomState>,
  msg: PutModelMessage<CustomState>,
): NovelModel<CustomState> => {
  return msg.model;
};
