import type {
  AddBusTrackMessage,
  AddCustomLayoutMessage,
  AddLayoutMessage,
  AddTextBoxMessage,
  AddTrackMessage,
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
  | AddLayoutMessage
  | ApplyMixerCompletedMessage
  | AddBusTrackMessage
  | AddCustomLayoutMessage<Component>
  | ShowImageMessage
  | AddTextBoxMessage
  | ShowTextMessage
  | RemoveWidgetsMessage
  | DelayMessage
  | DelayCompletedMessage
  | ErrorMessage
  | RecoverErrorMessage
  | ChangeMasterVolumeMessage
  | ClearTextBoxMessage
  | AddTrackMessage
  | RemoveChannelMessage
  | ChangeChannelVolumeMessage
  | PlayChannelMessage
  | StopChannelMessage
  | SequenceMessage<NovelMessage<Component>>;
