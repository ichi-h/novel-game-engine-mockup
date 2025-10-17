import type { IMixer } from '../../../mixer';

export const mockMixer: IMixer = {
  addChannel: () => Promise.resolve(),
  changeMasterVolume: () => void 0,
  removeChannel: (_name) => '',
  changeChannelVolume: () => '',
  playChannel: () => '',
  stopChannel: () => '',
  pauseChannel: () => '',
  resumeChannel: () => '',
};
