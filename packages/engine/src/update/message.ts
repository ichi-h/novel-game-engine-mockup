import type {
  AddBusTrackMessage,
  AddCustomLayoutMessage,
  AddLayoutMessage,
  AddTextBoxMessage,
  AddTrackMessage,
  AddWidgetsMessage,
  ApplyMixerCompletedMessage,
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
} from './message-handlers';

export type NovelMessage<Component> =
  // General
  | DelayMessage
  | DelayCompletedMessage
  | SequenceMessage<NovelMessage<Component>>
  | ErrorMessage
  | RecoverErrorMessage
  // Widgets
  | AddLayoutMessage
  | AddCustomLayoutMessage<Component>
  | ShowImageMessage
  | AddWidgetsMessage<Component>
  | AddTextBoxMessage
  | ShowTextMessage
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
  | ApplyMixerCompletedMessage;
