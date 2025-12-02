import { AudioFetcher, createApplyMixer } from 'driver';

const fetcher = new AudioFetcher();

export const initMixerDriver = () => {
  createApplyMixer(fetcher);
};

export const getApplyMixer = () => createApplyMixer(fetcher);
