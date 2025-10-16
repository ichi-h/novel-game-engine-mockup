import type { BaseMessage, ReturnModel } from 'elmish';

import type {
  DelayMs,
  FadeInMs,
  FadeOutMs,
  OffsetMs,
  Samples,
  Volume,
} from './mixer';
import type { NovelModel } from './model';

export interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  style?: string;
}

export interface AddCustomLayoutMessage<Component> extends BaseMessage {
  type: 'AddCustomLayout';
  id: string;
  parentLayoutId?: string;
  component: Component;
}

export interface ShowImageMessage extends BaseMessage {
  type: 'ShowImage';
  id?: string;
  layoutId: string;
  src: string;
  style?: string;
}

export interface AddTextBoxMessage extends BaseMessage {
  type: 'AddTextBox';
  id: string;
  layoutId: string;
  style?: string;
}

export interface ShowTextMessage extends BaseMessage {
  type: 'ShowText';
  id?: string;
  messageBoxId: string;
  content: string;
  style?: string;
  turnImmediately?: boolean;
  clearAllInBox?: boolean;
  speed?: number;
}

export interface RemoveObjectsMessage extends BaseMessage {
  type: 'RemoveObjects';
  ids: Exclude<string, 'root'>[];
}

export interface WaitForUserMessage extends BaseMessage {
  type: 'WaitForUser';
}

export interface DelayMessage extends BaseMessage {
  type: 'Delay';
  durationMs: number;
}

export interface ChangeMasterVolumeMessage extends BaseMessage {
  type: 'ChangeMasterVolume';
  name: string;
  masterVolume: Volume;
}

export interface CreateChannelMessage extends BaseMessage {
  type: 'CreateChannel';
  name: string;
  src: string;
  volume?: Volume;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

export interface RemoveChannelMessage extends BaseMessage {
  type: 'RemoveChannel';
  name: string;
}

export interface ChangeChannelVolumeMessage extends BaseMessage {
  type: 'ChangeChannelVolume';
  channelName: string;
  volume: Volume;
}

export interface PlaySoundMessage extends BaseMessage {
  type: 'PlaySound';
  channelName: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  offsetMs?: OffsetMs;
}

export interface StopSoundMessage extends BaseMessage {
  type: 'StopSound';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

export interface PauseSoundMessage extends BaseMessage {
  type: 'PauseSound';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

export interface ResumeSoundMessage extends BaseMessage {
  type: 'ResumeSound';
  channelName: string;
  fadeInMs?: FadeInMs;
}

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

export const update = <Component>(
  model: NovelModel,
  msg: NovelMessage<Component>,
): ReturnModel<NovelModel, NovelMessage<Component>> => {
  switch (msg.type) {
    case 'AddLayout': {
      // TODO: implement
      return model;
    }
    case 'ShowImage': {
      // TODO: implement
      return model;
    }
    case 'AddTextBox': {
      // TODO: implement
      return model;
    }
    case 'ShowText': {
      // TODO: implement
      return model;
    }
    case 'RemoveObjects': {
      // TODO: implement
      return model;
    }
    case 'WaitForUser': {
      // TODO: implement
      return model;
    }
    case 'Delay': {
      // TODO: implement
      return model;
    }
    case 'ChangeMasterVolume': {
      // TODO: implement
      return model;
    }
    case 'CreateChannel': {
      // TODO: implement
      return model;
    }
    case 'RemoveChannel': {
      // TODO: implement
      return model;
    }
    case 'ChangeChannelVolume': {
      // TODO: implement
      return model;
    }
    case 'PlaySound': {
      // TODO: implement
      return model;
    }
    case 'StopSound': {
      // TODO: implement
      return model;
    }
    case 'PauseSound': {
      // TODO: implement
      return model;
    }
    case 'ResumeSound': {
      // TODO: implement
      return model;
    }
    default:
      // TODO: implement
      return model;
  }
};
