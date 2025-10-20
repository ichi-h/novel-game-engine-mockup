import type { BaseMessage } from 'elmish';
import type { NovelModel } from '../../model';

export interface RemoveWidgetsMessage extends BaseMessage {
  type: 'RemoveWidgets';
  ids: string[];
}

export const handleRemoveWidgets = (
  model: NovelModel,
  msg: RemoveWidgetsMessage,
): NovelModel => {
  for (const id of msg.ids) {
    model.ui.removeById(id);
  }
  return model;
};
