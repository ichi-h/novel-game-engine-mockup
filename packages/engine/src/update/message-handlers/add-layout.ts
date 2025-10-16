import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';
import { layout } from '../../objects';

export interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  style?: string;
}

export const handleAddLayout = (
  model: NovelModel,
  msg: AddLayoutMessage,
): ReturnModel<NovelModel, never> => {
  const newLayout = layout({
    id: msg.id,
    ...(msg.style !== undefined && { style: msg.style }),
  })([]);
  model.ui.addObject(newLayout, msg.parentLayoutId);
  return model;
};
