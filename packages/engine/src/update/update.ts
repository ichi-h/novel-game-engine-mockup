import type { ReturnModel } from 'elmish';

import type { NovelModel } from '../model';

import type { NovelMessage } from './message';
import {
  handleAddCustomLayout,
  handleAddLayout,
  handleAddTextBox,
  handleChangeChannelVolume,
  handleChangeMasterVolume,
  handleCreateChannel,
  handleDelay,
  handlePauseSound,
  handlePlaySound,
  handleRemoveChannel,
  handleRemoveWidgets,
  handleResumeSound,
  handleShowImage,
  handleShowText,
  handleStopSound,
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
    case 'ChangeMasterVolume':
      return handleChangeMasterVolume(model, msg);
    case 'CreateChannel':
      return handleCreateChannel(model, msg);
    case 'RemoveChannel':
      return handleRemoveChannel(model, msg);
    case 'ChangeChannelVolume':
      return handleChangeChannelVolume(model, msg);
    case 'PlaySound':
      return handlePlaySound(model, msg);
    case 'StopSound':
      return handleStopSound(model, msg);
    case 'PauseSound':
      return handlePauseSound(model, msg);
    case 'ResumeSound':
      return handleResumeSound(model, msg);
    default:
      return model;
  }
};
