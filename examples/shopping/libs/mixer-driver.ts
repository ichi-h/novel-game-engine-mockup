import { createApplyMixer } from 'driver';

export const initMixerDriver = () => {
  createApplyMixer();
};

export const getApplyMixer = () => createApplyMixer();
