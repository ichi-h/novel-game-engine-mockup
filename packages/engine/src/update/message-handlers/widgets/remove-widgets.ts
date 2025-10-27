import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';

export interface RemoveWidgetsMessage extends BaseMessage {
  type: 'RemoveWidgets';
  ids: string[];
}

export const removeWidgets = (ids: string[]): RemoveWidgetsMessage => {
  return {
    type: 'RemoveWidgets',
    ids,
  };
};

export const handleRemoveWidgets = <Component>(
  model: NovelModel<Component>,
  msg: RemoveWidgetsMessage,
): NovelModel<Component> => {
  for (const id of msg.ids) {
    model.ui.removeById(id);
  }
  return model;
};
