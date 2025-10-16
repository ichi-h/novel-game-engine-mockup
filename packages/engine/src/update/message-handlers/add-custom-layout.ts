import type { BaseMessage } from 'elmish';
import type { NovelModel } from '../../model';
import { customLayout } from '../../objects';

export interface AddCustomLayoutMessage<Component> extends BaseMessage {
  type: 'AddCustomLayout';
  id: string;
  parentLayoutId?: string;
  component: Component;
}

export const handleAddCustomLayout = <Component>(
  model: NovelModel,
  msg: AddCustomLayoutMessage<Component>,
): NovelModel => {
  const newLayout = customLayout({
    id: msg.id,
    component: msg.component,
  })([]);
  model.ui.addObject(newLayout, msg.parentLayoutId);
  return model;
};
