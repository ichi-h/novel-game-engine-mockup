import { noView } from '@ichi-h/elmish';
import { generateInitModel, tsuzuri } from '@ichi-h/tsuzuri-core';
import { createApplyMixer } from '@ichi-h/tsuzuri-driver';
import { initMessage } from './scenario';

const applyMixer = createApplyMixer();
const initModel = generateInitModel();

export const { createSender, getModel, addListener, deleteListener } = tsuzuri(
  () => [initModel, async () => initMessage],
  applyMixer,
);

export const send = createSender(noView);

export const subscribe = (callback: () => void) => {
  addListener(callback);
  return () => {
    deleteListener(callback);
  };
};
