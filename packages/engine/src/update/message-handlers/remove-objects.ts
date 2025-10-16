import type { BaseMessage, ReturnModel } from 'elmish';
import type { NovelModel } from '../../model';

export interface RemoveObjectsMessage extends BaseMessage {
  type: 'RemoveObjects';
  ids: Exclude<string, 'root'>[];
}

export const handleRemoveObjects = (
  model: NovelModel,
  msg: RemoveObjectsMessage,
): ReturnModel<NovelModel, never> => {
  // TODO: implement
  return model;
};
