import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';

export interface AwaitActionMessage extends BaseMessage {
  type: 'AwaitAction';
}

export const awaitAction = (): AwaitActionMessage => {
  return {
    type: 'AwaitAction',
  };
};

export const handleAwaitAction = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  _msg: AwaitActionMessage,
): NovelModel<CustomState> => {
  return {
    ...model,
    status: { value: 'AwaitingAction' },
  };
};
