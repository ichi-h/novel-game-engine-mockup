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
  RemoveObjectsMessage,
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
  | RemoveObjectsMessage
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
