import type { BaseMessage } from '@ichi-h/elmish';
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

export const handleUpdateConfig = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: UpdateConfigMessage,
): NovelModel<CustomState> => {
  return {
    ...model,
    config: msg.config,
  };
};
