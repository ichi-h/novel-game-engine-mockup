import type {
  AddBusTrackMessage,
  AddButtonMessage,
  AddImageMessage,
  AddLayoutMessage,
  AddTextBoxMessage,
  AddTrackMessage,
  AddWidgetsMessage,
  ApplyMixerCompletedMessage,
  ApplyMixerMessage,
  AwaitActionMessage,
  ChangeChannelVolumeMessage,
  ChangeMasterVolumeMessage,
  ClearTextBoxMessage,
  DelayCompletedMessage,
  DelayMessage,
  ErrorMessage,
  NextMessage,
  PlayChannelMessage,
  PutModelMessage,
  RecoverErrorMessage,
  RemoveChannelMessage,
  RemoveWidgetsMessage,
  ResetPropertiesMessage,
  ScheduleMessage,
  SequenceMessage,
  ShowAddMessage,
  StopChannelMessage,
  SwitchScenarioMessage,
  TextAnimationCompletedMessage,
  UpdateConfigMessage,
  UpdateCustomStateMessage,
  UpdateWidgetStyleMessage,
} from './message-handlers';

export type NovelMessage<CustomState = unknown> =
  // General
  | NextMessage<CustomState>
  | SwitchScenarioMessage
  | AwaitActionMessage
  | DelayMessage
  | DelayCompletedMessage
  | ScheduleMessage<CustomState>
  | SequenceMessage<NovelMessage<CustomState>>
  | UpdateConfigMessage
  | UpdateCustomStateMessage<CustomState>
  | ResetPropertiesMessage<CustomState>
  | PutModelMessage<CustomState>
  | ErrorMessage
  | RecoverErrorMessage
  // Widgets
  | AddLayoutMessage
  | AddImageMessage
  | AddWidgetsMessage
  | AddButtonMessage
  | AddTextBoxMessage
  | ShowAddMessage
  | TextAnimationCompletedMessage
  | ClearTextBoxMessage
  | RemoveWidgetsMessage
  | UpdateWidgetStyleMessage
  // Mixer
  | AddTrackMessage
  | AddBusTrackMessage
  | PlayChannelMessage
  | StopChannelMessage
  | ChangeMasterVolumeMessage
  | ChangeChannelVolumeMessage
  | RemoveChannelMessage
  | ApplyMixerMessage
  | ApplyMixerCompletedMessage;

export type NovelMessageType = NovelMessage['type'];
