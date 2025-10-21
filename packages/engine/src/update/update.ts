import type { ReturnModel } from 'elmish';

import type { NovelModel } from '../model';

import type { NovelMessage } from './message';
import {
  handleAddChannel,
  handleAddCustomLayout,
  handleAddLayout,
  handleAddTextBox,
  handleChangeChannelVolume,
  handleChangeMasterVolume,
  handleClearTextBox,
  handleDelay,
  handleDelayCompleted,
  handleError,
  handlePauseChannel,
  handlePlayChannel,
  handleRecoverError,
  handleRemoveChannel,
  handleRemoveWidgets,
  handleResumeChannel,
  handleSequence,
  handleShowImage,
  handleShowText,
  handleStopChannel,
  handleSuccessFetchAudio,
  handleWaitForUser,
} from './message-handlers';

export const update = <Component>(
  model: NovelModel,
  msg: NovelMessage<Component>,
): ReturnModel<NovelModel, NovelMessage<Component>> => {
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
    case 'WaitForUser':
      return handleWaitForUser(model, msg);
    case 'Delay':
      return handleDelay(model, msg);
    case 'DelayCompleted':
      return handleDelayCompleted(model, msg);
    case 'ChangeMasterVolume':
      return handleChangeMasterVolume(model, msg);
    case 'ClearTextBox':
      return handleClearTextBox(model, msg);
    case 'AddChannel':
      return handleAddChannel(model, msg);
    case 'SuccessFetchAudio':
      return handleSuccessFetchAudio(model, msg);
    case 'RemoveChannel':
      return handleRemoveChannel(model, msg);
    case 'ChangeChannelVolume':
      return handleChangeChannelVolume(model, msg);
    case 'PlayChannel':
      return handlePlayChannel(model, msg);
    case 'StopChannel':
      return handleStopChannel(model, msg);
    case 'PauseChannel':
      return handlePauseChannel(model, msg);
    case 'ResumeChannel':
      return handleResumeChannel(model, msg);
    case 'Error':
      return handleError(model, msg);
    case 'RecoverError':
      return handleRecoverError(model);
    case 'Sequence':
      return handleSequence<NovelMessage<Component>>(model, msg, update);
    default: {
      const error = new Error(`Unhandled message type: ${JSON.stringify(msg)}`);
      return handleError(model, { type: 'Error', value: error });
    }
  }
};
