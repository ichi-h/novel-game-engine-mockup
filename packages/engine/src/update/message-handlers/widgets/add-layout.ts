import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, layout } from '@/ui';

export interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  style?: string;
}

export const addLayout = (
  id: string,
  parentLayoutId?: string,
  style?: string,
): AddLayoutMessage => {
  return {
    type: 'AddLayout',
    id,
    ...(parentLayoutId !== undefined ? { parentLayoutId } : {}),
    ...(style !== undefined ? { style } : {}),
  };
};

export const handleAddLayout = <Component>(
  model: NovelModel<Component>,
  msg: AddLayoutMessage,
): NovelModel<Component> => {
  const newLayout = layout<Component>({
    id: msg.id,
    ...(msg.style !== undefined && { style: msg.style }),
  })([]);
  return {
    ...model,
    ui: addWidget(model.ui, newLayout, msg.parentLayoutId),
  };
};
