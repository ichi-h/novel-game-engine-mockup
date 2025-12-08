import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, w } from '@/ui';

export interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  className?: string;
}

export const addLayout = ({
  id,
  parentLayoutId,
  className,
}: Omit<AddLayoutMessage, 'type'>): AddLayoutMessage => {
  return {
    type: 'AddLayout',
    id,
    ...(parentLayoutId !== undefined ? { parentLayoutId } : {}),
    ...(className !== undefined ? { className } : {}),
  };
};

export const handleAddLayout = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: AddLayoutMessage,
): NovelModel<CustomState> => {
  const newLayout = w.layout({
    id: msg.id,
    ...(msg.className !== undefined && { className: msg.className }),
  })([]);
  return {
    ...model,
    ui: addWidget(model.ui, newLayout, msg.parentLayoutId),
  };
};
