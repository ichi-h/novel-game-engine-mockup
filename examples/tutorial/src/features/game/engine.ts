import { noView } from '@ichi-h/elmish';
import { generateInitModel, tsuzuri } from '@ichi-h/tsuzuri-core';
import { createApplyMixer } from '@ichi-h/tsuzuri-driver';
import { loadConfig } from '../config/loadConfig';
import { convertTextSpeed } from '../config/utils';
import { initMessage } from './scenario';

const config = loadConfig();
const applyMixer = createApplyMixer();
const initModel = generateInitModel({
  textAnimationSpeed: convertTextSpeed(config.textSpeed),
});

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
