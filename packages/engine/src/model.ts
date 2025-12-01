import type { Mixer } from './mixer';
import type { NovelWidget } from './ui';
import type { NovelMessage, NovelMessageType } from './update';

export interface NovelConfig {
  historyLength: {
    [K in NovelMessageType]: number;
  };
  textAnimationSpeed: number;
}

export interface AnimationTicket {
  /**
   * The ID of the widget that is currently animating
   */
  id: string;

  /**
   * The remaining time until the animation is complete (ms)
   */
  ttl: number;

  /**
   * The behavior when the next message is sent
   *
   * - ignore: Do nothing
   * - complete: Complete the animation
   * - interrupt: Replace the received message with a message that completes the animation
   */
  nextMessageCaught: 'ignore' | 'complete' | 'interrupt';
}

export interface NovelModel<Component> {
  status:
    | {
        value: 'Processed';
      }
    | {
        value: 'Intercepted';
        message: NovelMessage<Component>;
      }
    | {
        value: 'Error';
        error: Error;
      };
  mixer: Mixer;
  ui: NovelWidget<Component>[];
  isDelaying: boolean;
  isApplyingMixer: boolean;
  animationTickets: AnimationTicket[];
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
      TextAnimationCompleted: 10,
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
    status: { value: 'Processed' },
    mixer: { channels: [], volume: 1.0 },
    ui: [],
    isDelaying: false,
    isApplyingMixer: false,
    animationTickets: [],
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
      TextAnimationCompleted: [],
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
