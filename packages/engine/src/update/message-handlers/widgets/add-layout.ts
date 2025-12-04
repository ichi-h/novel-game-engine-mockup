import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, w } from '@/ui';

export interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  style?: string;
}

export const addLayout = ({
  id,
  parentLayoutId,
  style,
}: Omit<AddLayoutMessage, 'type'>): AddLayoutMessage => {
  return {
    type: 'AddLayout',
    id,
    ...(parentLayoutId !== undefined ? { parentLayoutId } : {}),
    ...(style !== undefined ? { style } : {}),
  };
};

export const handleAddLayout = (
  model: NovelModel,
  msg: AddLayoutMessage,
): NovelModel => {
  const newLayout = w.layout({
    id: msg.id,
    ...(msg.style !== undefined && { style: msg.style }),
  })([]);
  return {
    ...model,
    ui: addWidget(model.ui, newLayout, msg.parentLayoutId),
  };
};
