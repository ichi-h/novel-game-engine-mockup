import type {
  AddBusTrackMessage,
  AddButtonMessage,
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
  RecoverErrorMessage,
  RemoveChannelMessage,
  RemoveWidgetsMessage,
  SequenceMessage,
  ShowImageMessage,
  ShowTextMessage,
  StopChannelMessage,
  SwitchScenarioMessage,
  TextAnimationCompletedMessage,
  UpdateConfigMessage,
  UpdateCustomStateMessage,
} from './message-handlers';

export type NovelMessage<
  CustomState = unknown,
> =
  // General
  | NextMessage<CustomState>
  | SwitchScenarioMessage
  | AwaitActionMessage
  | DelayMessage
  | DelayCompletedMessage
  | SequenceMessage<NovelMessage<CustomState>>
  | UpdateConfigMessage
  | UpdateCustomStateMessage<CustomState>
  | ErrorMessage
  | RecoverErrorMessage
  // Widgets
  | AddLayoutMessage
  | ShowImageMessage
  | AddWidgetsMessage
  | AddButtonMessage
  | AddTextBoxMessage
  | ShowTextMessage
  | TextAnimationCompletedMessage
  | ClearTextBoxMessage
  | RemoveWidgetsMessage
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
