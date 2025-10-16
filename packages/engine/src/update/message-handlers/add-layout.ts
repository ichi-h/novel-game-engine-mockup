import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  style?: string;
}

export const handleAddLayout = (
  model: NovelModel,
  msg: AddLayoutMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
