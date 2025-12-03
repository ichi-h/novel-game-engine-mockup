import type { ReturnModel } from 'elmish';
import type { ApplyMixer } from '@/mixer';
import type { NovelModel } from '../model';
import type { NovelMessage } from './message';
import {
  handleAddBusTrack,
  handleAddButton,
  handleAddLayout,
  handleAddTextBox,
  handleAddTrack,
  handleAddWidgets,
  handleApplyMixer,
  handleApplyMixerCompleted,
  handleChangeChannelVolume,
  handleChangeMasterVolume,
  handleClearTextBox,
  handleAwaitAction,
  handleDelay,
  handleDelayCompleted,
  handleError,
  handleNext,
  handlePlayChannel,
  handleRecoverError,
  handleRemoveChannel,
  handleRemoveWidgets,
  handleSequence,
  handleShowImage,
  handleShowText,
  handleStopChannel,
  handleSwitchScenario,
  handleTextAnimationCompleted,
  handleUpdateConfig,
  handleUpdateCustomState,
} from './message-handlers';

export type MiddlewareNext = (
  model: NovelModel,
  msg: NovelMessage,
) => ReturnModel<NovelModel, NovelMessage>;

export type Middleware = (
  model: NovelModel,
  msg: NovelMessage,
  next: MiddlewareNext,
) => ReturnModel<NovelModel, NovelMessage>;

export const update =
  (applyMixer: ApplyMixer, middlewares: Middleware[] = []) =>
  (
    model: NovelModel,
    msg: NovelMessage,
  ): ReturnModel<NovelModel, NovelMessage> => {
    const reducer: MiddlewareNext = (model: NovelModel, msg: NovelMessage) => {
      const updateWrapped = update(applyMixer, []);

      switch (msg.type) {
        // General
        case 'Next':
          return handleNext(model, msg, updateWrapped);
        case 'SwitchScenario':
          return handleSwitchScenario(model, msg);
        case 'AwaitAction':
          return handleAwaitAction(model, msg);
        case 'Delay':
          return handleDelay(model, msg);
        case 'DelayCompleted':
          return handleDelayCompleted(model, msg);
        case 'Sequence':
          return handleSequence(model, msg, updateWrapped);
        case 'UpdateConfig':
          return handleUpdateConfig(model, msg);
        case 'UpdateCustomState':
          return handleUpdateCustomState(model, msg);
        case 'Error':
          return handleError(model, msg);
        case 'RecoverError':
          return handleRecoverError(model);

        // Widgets
        case 'AddLayout':
          return handleAddLayout(model, msg);
        case 'ShowImage':
          return handleShowImage(model, msg);
        case 'AddButton':
          return handleAddButton(model, msg);
        case 'AddTextBox':
          return handleAddTextBox(model, msg);
        case 'ShowText':
          return handleShowText(model, msg);
        case 'TextAnimationCompleted':
          return handleTextAnimationCompleted(model, msg);
        case 'AddWidgets':
          return handleAddWidgets(model, msg);
        case 'ClearTextBox':
          return handleClearTextBox(model, msg);
        case 'RemoveWidgets':
          return handleRemoveWidgets(model, msg);

        // Mixer
        case 'AddTrack':
          return handleAddTrack(model, msg, updateWrapped);
        case 'AddBusTrack':
          return handleAddBusTrack(model, msg, updateWrapped);
        case 'PlayChannel':
          return handlePlayChannel(model, msg, updateWrapped);
        case 'StopChannel':
          return handleStopChannel(model, msg, updateWrapped);
        case 'ChangeMasterVolume':
          return handleChangeMasterVolume(model, msg, updateWrapped);
        case 'ChangeChannelVolume':
          return handleChangeChannelVolume(model, msg, updateWrapped);
        case 'RemoveChannel':
          return handleRemoveChannel(model, msg, updateWrapped);
        case 'ApplyMixer':
          return handleApplyMixer(model, msg, applyMixer);
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

    if (middlewares.length === 0) {
      return reducer(model, msg);
    }

    const composeMiddlewares = middlewares.reduceRight<MiddlewareNext>(
      (next, cur) => {
        return (model, msg) => cur(model, msg, next);
      },
      reducer,
    );

    return composeMiddlewares(model, msg);
  };
