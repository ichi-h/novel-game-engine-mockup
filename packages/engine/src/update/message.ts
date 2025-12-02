import type {
  AddBusTrackMessage,
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
  TextAnimationCompletedMessage,
  UpdateConfigMessage,
} from './message-handlers';

export type NovelMessage<Component> =
  // General
  | DelayMessage
  | DelayCompletedMessage
  | SequenceMessage<NovelMessage<Component>>
  | UpdateConfigMessage
  | ErrorMessage
  | RecoverErrorMessage
  // Widgets
  | AddLayoutMessage
  | ShowImageMessage
  | AddWidgetsMessage<Component>
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
  | ApplyMixerCompletedMessage;

export type NovelMessageType = NovelMessage<unknown>['type'];
