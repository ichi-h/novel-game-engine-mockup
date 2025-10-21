import type { BaseMessage, ReturnModel } from 'elmish';
import type { Samples, Volume } from '../../mixer';
import type { NovelModel } from '../../model';

export interface AddChannelMessage extends BaseMessage {
  type: 'AddChannel';
  name: string;
  source: ArrayBuffer;
  volume?: Volume;
  loop?: {
    start: Samples;
    end: Samples;
  };
}

export const handleAddChannel = (
  model: NovelModel,
  msg: AddChannelMessage,
): ReturnModel<NovelModel, never> => {
  model.mixer.addChannel(
    msg.name,
    msg.source,
    msg.volume ?? 1.0,
    msg.loop !== undefined,
    msg.loop?.start,
    msg.loop?.end,
  );
  return model;
};
