import {
  type BaseMessage,
  elmish,
  type ReturnModel,
  type Update,
} from 'elmish';

interface NovelObject {
  id: string;
  type: 'Layout' | 'CustomLayout' | 'Image' | 'TextBox' | 'Text';
}

interface LayoutObject extends NovelObject {
  type: 'Layout';
  style?: string;
  children: NovelObject[];
}

interface CustomLayoutObject<Component> extends NovelObject {
  type: 'CustomLayout';
  component: Component;
  children: NovelObject[];
}

interface ImageObject extends NovelObject {
  type: 'Image';
  style?: string;
  src: string;
}

interface TextObject extends NovelObject {
  type: 'Text';
  style?: string;
  content: string;
}

interface TextBoxObject extends NovelObject {
  type: 'TextBox';
  style?: string;
  children: TextObject[];
}

type LayoutProps = Omit<LayoutObject, 'type' | 'children'>;
const layout =
  (props: LayoutProps) =>
  (children: NovelObject[]): LayoutObject => ({
    ...props,
    type: 'Layout',
    children,
  });

type CustomLayoutProps<Component> = Omit<
  CustomLayoutObject<Component>,
  'type' | 'children'
>;
const customLayout =
  <Component>(props: CustomLayoutProps<Component>) =>
  (children: NovelObject[]): CustomLayoutObject<Component> => ({
    ...props,
    type: 'CustomLayout',
    children,
  });

type ImageProps = Omit<ImageObject, 'type'>;
const img = (props: ImageProps): ImageObject => ({
  ...props,
  type: 'Image',
});

type TextBoxProps = Omit<TextBoxObject, 'type' | 'texts'>;
const textBox =
  (props: TextBoxProps) =>
  (children: TextObject[]): TextBoxObject => ({
    ...props,
    type: 'TextBox',
    children,
  });

type TextProps = Omit<TextObject, 'type'>;
const text = (props: TextProps): TextObject => ({
  ...props,
  type: 'Text',
});

// -------------------------------
export type FadeInMs = number;
export type FadeOutMs = number;
export type DelayMs = number;
export type OffsetMs = number;
export type Volume = number;
export type Samples = number;

export interface IMixer {
  changeMasterVolume(volume: Volume): void;
  addChannel(
    name: string,
    source: ArrayBuffer,
    volume?: Volume,
    isLoop?: boolean,
    loopStart?: Samples,
    loopEnd?: Samples,
  ): Promise<void>;
  removeChannel(name: string): string;
  playChannel(
    name: string,
    delayMs?: DelayMs,
    offsetMs?: OffsetMs,
    fadeInMs?: FadeInMs,
    fadeOutMs?: FadeOutMs,
  ): string;
  stopChannel(name: string, fadeOutMs?: FadeOutMs): string;
  pauseChannel(name: string, fadeOutMs?: FadeOutMs): string;
  resumeChannel(name: string, fadeInMs?: FadeInMs): string;
  changeChannelVolume(name: string, volume: Volume): string;
}

interface AddLayoutMessage extends BaseMessage {
  type: 'AddLayout';
  id: string;
  parentLayoutId?: string;
  style?: string;
}

interface AddCustomLayoutMessage<Component> extends BaseMessage {
  type: 'AddCustomLayout';
  id: string;
  parentLayoutId?: string;
  component: Component;
}

interface ShowImageMessage extends BaseMessage {
  type: 'ShowImage';
  id?: string;
  layoutId: string;
  src: string;
  style?: string;
}

interface AddTextBoxMessage extends BaseMessage {
  type: 'AddTextBox';
  id: string;
  layoutId: string;
  style?: string;
}

interface ShowTextMessage extends BaseMessage {
  type: 'ShowText';
  id?: string;
  messageBoxId: string;
  content: string;
  style?: string;
  turnImmediately?: boolean;
  clearAllInBox?: boolean;
  speed?: number;
}

interface RemoveObjectsMessage extends BaseMessage {
  type: 'RemoveObjects';
  ids: Exclude<string, 'root'>[];
}

interface WaitForUserMessage extends BaseMessage {
  type: 'WaitForUser';
}

interface DelayMessage extends BaseMessage {
  type: 'Delay';
  durationMs: number;
}

interface ChangeMasterVolumeMessage extends BaseMessage {
  type: 'ChangeMasterVolume';
  name: string;
  masterVolume: Volume;
}

interface CreateChannelMessage extends BaseMessage {
  type: 'CreateChannel';
  name: string;
  src: string;
  volume?: Volume;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

interface RemoveChannelMessage extends BaseMessage {
  type: 'RemoveChannel';
  name: string;
}

interface ChangeChannelVolumeMessage extends BaseMessage {
  type: 'ChangeChannelVolume';
  channelName: string;
  volume: Volume;
}

interface PlaySoundMessage extends BaseMessage {
  type: 'PlaySound';
  channelName: string;
  fadeInMs?: FadeInMs;
  fadeOutMs?: FadeOutMs;
  delayMs?: DelayMs;
  offsetMs?: number;
}

interface StopSoundMessage extends BaseMessage {
  type: 'StopSound';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

interface PauseSoundMessage extends BaseMessage {
  type: 'PauseSound';
  channelName: string;
  fadeOutMs?: FadeOutMs;
}

interface ResumeSoundMessage extends BaseMessage {
  type: 'ResumeSound';
  channelName: string;
  fadeInMs?: FadeInMs;
}

type NovelMessage<Component> =
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

// -------------------------------

interface Model {
  mixer: IMixer;
  ui: NovelObject[];
}

const initModel = (mixer: IMixer): Model => ({
  mixer,
  ui: [],
});

// const useElement = elmish<Model, NovelMessage>();

// -------------------------------

const update = <Component>(
  model: Model,
  msg: NovelMessage<Component>,
): ReturnModel<Model, NovelMessage<Component>> => {
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
