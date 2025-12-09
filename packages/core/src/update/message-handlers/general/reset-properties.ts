import type { BaseMessage } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';
import { generateInitModel } from '@/model';

type ResettableKeys<CustomState> = Exclude<
  keyof NovelModel<CustomState>,
  'config'
>;

export interface ResetPropertiesMessage<CustomState = unknown>
  extends BaseMessage {
  type: 'ResetProperties';
  properties: ResettableKeys<CustomState>[];
}

export const resetProperties = <CustomState = unknown>(
  properties: ResettableKeys<CustomState>[],
): ResetPropertiesMessage<CustomState> => {
  return {
    type: 'ResetProperties',
    properties,
  };
};

export const handleResetProperties = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: ResetPropertiesMessage<CustomState>,
): NovelModel<CustomState> => {
  // Generate a fresh initial model to get default values
  const initModel = generateInitModel<CustomState>();

  // Create a new model with reset properties
  const resetModel = { ...model };

  // Reset each specified property to its initial value
  for (const property of msg.properties) {
    // @ts-expect-error - We know the property exists in both models
    resetModel[property] = initModel[property];
  }

  return resetModel;
};
