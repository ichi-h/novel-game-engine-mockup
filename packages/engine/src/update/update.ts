import type { ReturnModel } from 'elmish';
import type { ApplyMixer } from '@/mixer';
import type { NovelModel } from '../model';
import type { NovelMessage } from './message';
import {
  handleAddBusTrack,
  handleAddCustomLayout,
  handleAddLayout,
  handleAddTextBox,
  handleAddTrack,
  handleApplyMixerCompleted,
  handleChangeChannelVolume,
  handleChangeMasterVolume,
  handleClearTextBox,
  handleDelay,
  handleDelayCompleted,
  handleError,
  handlePlayChannel,
  handleRecoverError,
  handleRemoveChannel,
  handleRemoveWidgets,
  handleSequence,
  handleShowImage,
  handleShowText,
  handleStopChannel,
} from './message-handlers';

export const update =
  <Component>(applyMixer: ApplyMixer) =>
  (
    model: NovelModel<Component>,
    msg: NovelMessage<Component>,
  ): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
    const updateWrapped = update<Component>(applyMixer);

    switch (msg.type) {
      // General
      case 'Delay':
        return handleDelay(model, msg);
      case 'DelayCompleted':
        return handleDelayCompleted(model, msg);
      case 'Sequence':
        return handleSequence<Component>(model, msg, updateWrapped);
      case 'Error':
        return handleError(model, msg);
      case 'RecoverError':
        return handleRecoverError(model);

      // Widgets
      case 'AddLayout':
        return handleAddLayout(model, msg);
      case 'AddCustomLayout':
        return handleAddCustomLayout(model, msg);
      case 'ShowImage':
        return handleShowImage(model, msg);
      case 'AddTextBox':
        return handleAddTextBox(model, msg);
      case 'ShowText':
        return handleShowText(model, msg);
      case 'ClearTextBox':
        return handleClearTextBox(model, msg);
      case 'RemoveWidgets':
        return handleRemoveWidgets(model, msg);

      // Mixer
      case 'AddTrack':
        return handleAddTrack(model, msg, updateWrapped, applyMixer);
      case 'AddBusTrack':
        return handleAddBusTrack(model, msg, updateWrapped, applyMixer);
      case 'PlayChannel':
        return handlePlayChannel(model, msg, updateWrapped, applyMixer);
      case 'StopChannel':
        return handleStopChannel(model, msg, updateWrapped, applyMixer);
      case 'ChangeMasterVolume':
        return handleChangeMasterVolume(model, msg, applyMixer);
      case 'ChangeChannelVolume':
        return handleChangeChannelVolume(model, msg, updateWrapped, applyMixer);
      case 'RemoveChannel':
        return handleRemoveChannel(model, msg, updateWrapped, applyMixer);
      case 'ApplyMixerCompleted':
        return handleApplyMixerCompleted(model, msg, updateWrapped);

      default: {
        return handleError(model, {
          type: 'Error',
          value: new Error(`Unhandled message type: ${JSON.stringify(msg)}`),
        });
      }
    }
  };
