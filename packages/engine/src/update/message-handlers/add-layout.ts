import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { layout } from '@/ui';

export interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  style?: string;
}

export const handleAddLayout = <Component>(
  model: NovelModel<Component>,
  msg: AddLayoutMessage,
): NovelModel<Component> => {
  const newLayout = layout<Component>({
    id: msg.id,
    ...(msg.style !== undefined && { style: msg.style }),
  })([]);
  model.ui.addWidget(newLayout, msg.parentLayoutId);
  return model;
};
