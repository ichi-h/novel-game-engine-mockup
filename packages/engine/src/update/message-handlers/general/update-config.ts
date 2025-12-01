import type { BaseMessage } from 'elmish';
import type { NovelConfig, NovelModel } from '@/model';

export interface UpdateConfigMessage extends BaseMessage {
  type: 'UpdateConfig';
  config: NovelConfig;
}

export const updateConfig = (config: NovelConfig): UpdateConfigMessage => {
  return {
    type: 'UpdateConfig',
    config,
  };
};

export const handleUpdateConfig = <Component>(
  model: NovelModel<Component>,
  msg: UpdateConfigMessage,
): NovelModel<Component> => {
  return {
    ...model,
    config: msg.config,
  };
};
