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

export const handleAwaitAction = (
  model: NovelModel,
  _msg: AwaitActionMessage,
): NovelModel => {
  return {
    ...model,
    status: { value: 'AwaitingAction' },
  };
};
