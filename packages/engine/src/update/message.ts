import type {
  AddBusTrackMessage,
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
  PlayChannelMessage,
  RecoverErrorMessage,
  RemoveChannelMessage,
  RemoveWidgetsMessage,
  SequenceMessage,
  ShowImageMessage,
  ShowTextMessage,
  StopChannelMessage,
  TextAnimationCompletedMessage,
  UpdateConfigMessage,
} from './message-handlers';

export type NovelMessage =
  // General
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
