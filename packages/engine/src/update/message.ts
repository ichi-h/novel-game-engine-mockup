import type {
  AddCustomLayoutMessage,
  AddLayoutMessage,
  AddTextBoxMessage,
  ChangeChannelVolumeMessage,
  ChangeMasterVolumeMessage,
  CreateChannelMessage,
  DelayMessage,
  PauseSoundMessage,
  PlaySoundMessage,
  RemoveChannelMessage,
  RemoveWidgetsMessage,
  ResumeSoundMessage,
  ShowImageMessage,
  ShowTextMessage,
  StopSoundMessage,
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
  | ChangeMasterVolumeMessage
  | CreateChannelMessage
  | RemoveChannelMessage
  | ChangeChannelVolumeMessage
  | PlaySoundMessage
  | StopSoundMessage
  | PauseSoundMessage
  | ResumeSoundMessage;
