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
  handlePauseChannel,
  handlePlayChannel,
  handleRemoveChannel,
  handleRemoveWidgets,
  handleResumeChannel,
  handleShowImage,
  handleShowText,
  handleStopChannel,
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
    default:
      return model;
  }
};
