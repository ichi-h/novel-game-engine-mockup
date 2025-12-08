import { createApplyMixer } from '@ichi-h/tsuzuri-driver';

export const initMixerDriver = () => {
  createApplyMixer();
};

export const getApplyMixer = () => createApplyMixer();
