import type { BaseMessage, ReturnModel } from 'elmish';
import type { Samples, Volume } from '../../mixer';
import type { NovelModel } from '../../model';
import type { ErrorMessage } from './error';

export interface AddChannelMessage extends BaseMessage {
  type: 'AddChannel';
  name: string;
  src: string;
  volume?: Volume;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

export interface SuccessFetchAudioMessage
  extends Omit<AddChannelMessage, 'type' | 'src'> {
  type: 'SuccessFetchAudio';
  arrayBuffer: ArrayBuffer;
}

export const addChannel = (
  name: string,
  src: string,
  volume?: Volume,
  loop?: { start: Samples; end: Samples },
): AddChannelMessage => {
  return {
    type: 'AddChannel',
    name,
    src,
    ...(volume !== undefined ? { volume } : {}),
    ...(loop !== undefined ? { loop } : {}),
  };
};

export const handleAddChannel = <Component>(
  model: NovelModel<Component>,
  msg: AddChannelMessage,
): ReturnModel<
  NovelModel<Component>,
  SuccessFetchAudioMessage | ErrorMessage
> => {
  return [
    { ...model, isFetching: true },
    async () => {
      try {
        const response = await fetch(msg.src);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch audio from ${msg.src}: ${response.statusText}`,
          );
        }
        const arrayBuffer = await response.arrayBuffer();
        return {
          type: 'SuccessFetchAudio',
          name: msg.name,
          ...(msg.volume !== undefined ? { volume: msg.volume } : {}),
          ...(msg.loop !== undefined ? { loop: msg.loop } : {}),
          arrayBuffer,
        };
      } catch (error) {
        return {
          type: 'Error',
          value: error as Error,
        };
      }
    },
  ];
};

export const handleSuccessFetchAudio = <Component>(
  model: NovelModel<Component>,
  msg: SuccessFetchAudioMessage,
): NovelModel<Component> => {
  model.mixer.addChannel(
    msg.name,
    msg.arrayBuffer,
    msg.volume ?? 1.0,
    msg.loop !== undefined,
    msg.loop?.start,
    msg.loop?.end,
  );
  model.isFetching = false;
  return model;
};
