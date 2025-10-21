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
  PauseChannelMessage,
  PlayChannelMessage,
  RemoveChannelMessage,
  RemoveWidgetsMessage,
  ResumeChannelMessage,
  ShowImageMessage,
  ShowTextMessage,
  StopChannelMessage,
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
  | ChangeMasterVolumeMessage
  | ClearTextBoxMessage
  | AddChannelMessage
  | RemoveChannelMessage
  | ChangeChannelVolumeMessage
  | PlayChannelMessage
  | StopChannelMessage
  | PauseChannelMessage
  | ResumeChannelMessage;
