import type { Mixer } from './mixer';
import type { NovelWidget } from './ui';
import type { NovelMessage } from './update';

type NovelMessageType = NovelMessage<unknown>['type'];

export interface NovelConfig {
  historyLength: {
    [K in NovelMessageType]: number;
  };
  textAnimationSpeed: number;
}

export interface NovelModel<Component> {
  mixer: Mixer;
  ui: NovelWidget<Component>[];
  isDelaying: boolean;
  isApplyingMixer: boolean;
  error: Error | null;
  history: {
    [K in NovelMessageType]: Extract<NovelMessage<Component>, { type: K }>[];
  };
  config: NovelConfig;
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type InitModelConfig = DeepPartial<NovelConfig>;

const createDefaultConfig = () =>
  ({
    historyLength: {
      Delay: 10,
      DelayCompleted: 10,
      Sequence: 10,
      Error: 200,
      RecoverError: 10,
      UpdateConfig: 10,
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
    textAnimationSpeed: 50,
  }) satisfies NovelConfig;

export const generateInitModel = <Component>(
  initConfig?: InitModelConfig,
): NovelModel<Component> => {
  const defaultConfig = createDefaultConfig();

  const config: NovelConfig = {
    historyLength: {
      ...defaultConfig.historyLength,
      ...initConfig?.historyLength,
    },
    textAnimationSpeed:
      initConfig?.textAnimationSpeed ?? defaultConfig.textAnimationSpeed,
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
      UpdateConfig: [],
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
    config,
  };
};
