import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface AddCustomLayoutMessage<Component> extends BaseMessage {
  type: 'AddCustomLayout';
  id: string;
  parentLayoutId?: string;
  component: Component;
}

export const handleAddCustomLayout = <Component>(
  model: NovelModel,
  msg: AddCustomLayoutMessage<Component>,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
