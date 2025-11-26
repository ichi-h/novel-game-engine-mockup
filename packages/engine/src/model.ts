import type { Mixer } from './mixer';
import type { NovelWidget } from './ui';
import type { NovelMessage } from './update';

type NovelMessageType<Component> = NovelMessage<Component>['type'];

export interface NovelModel<Component> {
  mixer: Mixer;
  ui: NovelWidget<Component>[];
  isDelaying: boolean;
  isApplyingMixer: boolean;
  error: Error | null;
  history: {
    [K in NovelMessageType<Component>]: Extract<
      NovelMessage<Component>,
      { type: K }
    >[];
  };
  historyLength: {
    [K in NovelMessageType<Component>]: number;
  };
}

export interface InitModelConfig<Component> {
  historyLength: {
    [K in NovelMessageType<Component>]?: number;
  };
}

const createDefaultConfig = <Component>() =>
  ({
    historyLength: {
      Delay: 10,
      DelayCompleted: 10,
      Sequence: 10,
      Error: 200,
      RecoverError: 10,
      AddLayout: 10,
      AddCustomLayout: 10,
      ShowImage: 10,
      AddWidgets: 10,
      AddTextBox: 200,
      ShowText: 10,
      ClearTextBox: 10,
      RemoveWidgets: 10,
      AddTrack: 10,
      AddBusTrack: 10,
      PlayChannel: 10,
      StopChannel: 10,
      ChangeMasterVolume: 10,
      ChangeChannelVolume: 10,
      RemoveChannel: 10,
      ApplyMixerCompleted: 10,
    },
  }) satisfies InitModelConfig<Component>;

export const generateInitModel = <Component>(
  config?: InitModelConfig<Component>,
): NovelModel<Component> => {
  const defaultConfig = createDefaultConfig<Component>();

  const mergedConfig = { ...defaultConfig, ...config };

  const historyLength = {
    ...defaultConfig.historyLength,
    ...mergedConfig.historyLength,
  };

  return {
    mixer: { channels: [], volume: 1.0 },
    ui: [],
    isDelaying: false,
    isApplyingMixer: false,
    error: null,
    history: {
      Delay: [],
      DelayCompleted: [],
      Sequence: [],
      Error: [],
      RecoverError: [],
      AddLayout: [],
      AddCustomLayout: [],
      ShowImage: [],
      AddWidgets: [],
      AddTextBox: [],
      ShowText: [],
      ClearTextBox: [],
      RemoveWidgets: [],
      AddTrack: [],
      AddBusTrack: [],
      PlayChannel: [],
      StopChannel: [],
      ChangeMasterVolume: [],
      ChangeChannelVolume: [],
      RemoveChannel: [],
      ApplyMixerCompleted: [],
    },
    historyLength,
  };
};
