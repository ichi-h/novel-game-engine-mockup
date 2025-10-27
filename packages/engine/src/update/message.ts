import type {
  AddChannelMessage,
  AddCustomLayoutMessage,
  AddLayoutMessage,
  AddTextBoxMessage,
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
  | AddChannelMessage
  | RemoveChannelMessage
  | ChangeChannelVolumeMessage
  | PlayChannelMessage
  | StopChannelMessage
  | SequenceMessage<NovelMessage<Component>>;
