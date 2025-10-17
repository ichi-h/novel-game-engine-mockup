import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { layout } from '@/ui';

export interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  style?: string;
}

export const handleAddLayout = (
  model: NovelModel,
  msg: AddLayoutMessage,
): NovelModel => {
  const newLayout = layout({
    id: msg.id,
    ...(msg.style !== undefined && { style: msg.style }),
  })([]);
  model.ui.addWidget(newLayout, msg.parentLayoutId);
  return model;
};
