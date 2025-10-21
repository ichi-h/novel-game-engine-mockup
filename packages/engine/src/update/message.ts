import type {
  AddChannelMessage,
  AddCustomLayoutMessage,
  AddLayoutMessage,
  AddTextBoxMessage,
  ChangeChannelVolumeMessage,
  ChangeMasterVolumeMessage,
  ClearTextBoxMessage,
  DelayCompletedMessage,
  DelayMessage,
  ErrorMessage,
  PauseChannelMessage,
  PlayChannelMessage,
  RecoverErrorMessage,
  RemoveChannelMessage,
  RemoveWidgetsMessage,
  ResumeChannelMessage,
  ShowImageMessage,
  ShowTextMessage,
  StopChannelMessage,
  SuccessFetchAudioMessage,
  WaitForUserMessage,
} from './message-handlers';

export type NovelMessage<Component> =
  | AddLayoutMessage
  | AddCustomLayoutMessage<Component>
  | ShowImageMessage
  | AddTextBoxMessage
  | ShowTextMessage
  | RemoveWidgetsMessage
  | WaitForUserMessage
  | DelayMessage
  | DelayCompletedMessage
  | ErrorMessage
  | RecoverErrorMessage
  | ChangeMasterVolumeMessage
  | ClearTextBoxMessage
  | AddChannelMessage
  | SuccessFetchAudioMessage
  | RemoveChannelMessage
  | ChangeChannelVolumeMessage
  | PlayChannelMessage
  | StopChannelMessage
  | PauseChannelMessage
  | ResumeChannelMessage;
