import type { BaseMessage } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';

export interface UpdateCustomStateMessage<CustomState = unknown>
  extends BaseMessage {
  type: 'UpdateCustomState';
  value: CustomState;
}

export const updateCustomState = <CustomState = unknown>(
  value: CustomState,
): UpdateCustomStateMessage<CustomState> => {
  return {
    type: 'UpdateCustomState',
    value,
  };
};

export const handleUpdateCustomState = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: UpdateCustomStateMessage<CustomState>,
): NovelModel<CustomState> => {
  return {
    ...model,
    customState: msg.value,
  };
};
