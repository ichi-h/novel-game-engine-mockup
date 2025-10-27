import type { BaseMessage, ReturnModel } from 'elmish';
import type { ApplyMixer, Volume } from '@/mixer-v2';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '../message';

export interface ChangeMasterVolumeMessage extends BaseMessage {
  type: 'ChangeMasterVolume';
  name: string;
  masterVolume: Volume;
}

export const changeMasterVolume = (
  name: string,
  masterVolume: Volume,
): ChangeMasterVolumeMessage => {
  return {
    type: 'ChangeMasterVolume',
    name,
    masterVolume,
  };
};

export const handleChangeMasterVolume = <Component>(
  model: NovelModel<Component>,
  msg: ChangeMasterVolumeMessage,
  applyMixer: ApplyMixer,
): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
  const updatedMixer = {
    ...model.mixer,
    volume: msg.masterVolume,
  };

  const updatedModel = {
    ...model,
    mixer: updatedMixer,
    isApplyingMixer: true,
  };

  return [
    updatedModel,
    async () => {
      let error: Error | null = null;
      try {
        await applyMixer(updatedMixer);
      } catch (e) {
        error = e instanceof Error ? e : new Error(String(e));
      }
      return {
        type: 'ApplyMixerCompleted',
        error,
      };
    },
  ];
};
