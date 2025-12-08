import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { removeById } from '@/ui';

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

export const handleRemoveWidgets = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: RemoveWidgetsMessage,
): NovelModel<CustomState> => {
  return {
    ...model,
    ui: msg.ids.reduce((ui, id) => removeById(ui, id), model.ui),
  };
};
