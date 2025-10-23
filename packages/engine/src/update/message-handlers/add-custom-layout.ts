import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { customLayout } from '@/ui';

export interface AddCustomLayoutMessage<Component> extends BaseMessage {
  type: 'AddCustomLayout';
  id: string;
  parentLayoutId?: string;
  component: Component;
}

export const addCustomLayout = <Component>(
  id: string,
  component: Component,
  parentLayoutId?: string,
): AddCustomLayoutMessage<Component> => {
  return {
    type: 'AddCustomLayout',
    id,
    component,
    ...(parentLayoutId !== undefined ? { parentLayoutId } : {}),
  };
};

export const handleAddCustomLayout = <Component>(
  model: NovelModel<Component>,
  msg: AddCustomLayoutMessage<Component>,
): NovelModel<Component> => {
  const newLayout = customLayout({
    id: msg.id,
    component: msg.component,
  })([]);
  model.ui.addWidget(newLayout, msg.parentLayoutId);
  return model;
};
