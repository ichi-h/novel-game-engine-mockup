import type { ReturnModel } from 'elmish';
import type { ApplyMixer } from '@/mixer-v2';
import type { NovelModel } from '../model';
import type { NovelMessage } from './message';
import {
  handleAddChannel,
  handleAddCustomLayout,
  handleAddLayout,
  handleAddTextBox,
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
    switch (msg.type) {
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
      case 'RemoveWidgets':
        return handleRemoveWidgets(model, msg);
      case 'Delay':
        return handleDelay(model, msg);
      case 'DelayCompleted':
        return handleDelayCompleted(model, msg);
      case 'ChangeMasterVolume':
        return handleChangeMasterVolume(model, msg, applyMixer);
      case 'ApplyMixerCompleted':
        return handleApplyMixerCompleted(model, msg, update(applyMixer));
      case 'ClearTextBox':
        return handleClearTextBox(model, msg);
      case 'AddChannel':
        return handleAddChannel(model, msg, applyMixer);
      case 'RemoveChannel':
        return handleRemoveChannel(model, msg, applyMixer);
      case 'ChangeChannelVolume':
        return handleChangeChannelVolume(model, msg, applyMixer);
      case 'PlayChannel':
        return handlePlayChannel(model, msg, applyMixer);
      case 'StopChannel':
        return handleStopChannel(model, msg, applyMixer);
      case 'Error':
        return handleError(model, msg);
      case 'RecoverError':
        return handleRecoverError(model);
      case 'Sequence':
        return handleSequence<Component>(model, msg, update(applyMixer));
      default: {
        const error = new Error(
          `Unhandled message type: ${JSON.stringify(msg)}`,
        );
        return handleError(model, { type: 'Error', value: error });
      }
    }
  };
