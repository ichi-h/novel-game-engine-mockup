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
   * - ignore: Do nothing.
   * - merge: Merge the animation completed message with the next message.
   * - insert: Insert the animation completed message before the scheduled message.
   *   At this point, the scheduled message is held until the user takes the next action.
   */
  nextMessageCaught: 'ignore' | 'merge' | 'insert';
}

export type NovelStatus =
  | {
      value: 'Processed';
    }
  | {
      value: 'Merged';
      message: NovelMessage;
    }
  | {
      value: 'Inserted';
      message: NovelMessage;
      before: NovelMessage;
    }
  | {
      value: 'Delaying';
      remainingTime: number;
    }
  | {
      value: 'AwaitingAction';
    }
  | {
      value: 'RequestingNext';
    }
  | {
      value: 'Error';
      error: Error;
    };

export interface NovelModel<
  CustomState = unknown,
> {
  status: NovelStatus;
  currentScenario: string;
  index: number;
  mixer: {
    value: Mixer;
    isApplying: boolean;
  };
  ui: NovelWidget[];
  animationTickets: AnimationTicket[];
  history: {
    [K in NovelMessageType]: Extract<NovelMessage, { type: K }>[];
  };
  config: NovelConfig;
  customState?: CustomState;
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type InitModelConfig = DeepPartial<NovelConfig>;

export const defaultConfig: NovelConfig = {
  historyLength: {
    Next: 200,
    SwitchScenario: 10,
    AwaitAction: 10,
    Delay: 10,
    DelayCompleted: 10,
    Sequence: 10,
    Error: 200,
    RecoverError: 10,
    UpdateConfig: 10,
    UpdateCustomState: 10,
    AddLayout: 10,
    ShowImage: 10,
    AddButton: 10,
    AddWidgets: 10,
    AddTextBox: 10,
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
    ApplyMixer: 10,
    ApplyMixerCompleted: 10,
  },
  textAnimationSpeed: 50,
};

export const generateInitModel = <
  CustomState = unknown,
>(
  customState?: CustomState,
  initConfig?: InitModelConfig,
): NovelModel<CustomState> => {
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
    currentScenario: 'main',
    index: 0,
    mixer: {
      value: { volume: 1, channels: [] },
      isApplying: false,
    },
    ui: [],
    animationTickets: [],
    history: {
      Next: [],
      SwitchScenario: [],
      AwaitAction: [],
      Delay: [],
      DelayCompleted: [],
      Sequence: [],
      Error: [],
      RecoverError: [],
      UpdateConfig: [],
      UpdateCustomState: [],
      AddLayout: [],
      ShowImage: [],
      AddButton: [],
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
      ApplyMixer: [],
      ApplyMixerCompleted: [],
    },
    config,
    ...(customState !== undefined ? { customState } : {}),
  };
};
