import type {
  AddBusTrackMessage,
  AddButtonMessage,
  AddLayoutMessage,
  AddTextBoxMessage,
  AddTrackMessage,
  AddWidgetsMessage,
  ApplyMixerCompletedMessage,
  ApplyMixerMessage,
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
} from './message-handlers';

export type NovelMessage =
  // General
  | NextMessage
  | SwitchScenarioMessage
  | DelayMessage
  | DelayCompletedMessage
  | SequenceMessage<NovelMessage>
  | UpdateConfigMessage
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
