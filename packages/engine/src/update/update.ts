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
  handleAddWidgets,
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
  handleTextAnimationCompleted,
  handleUpdateConfig,
} from './message-handlers';

export type MiddlewareNext<Component> = (
  model: NovelModel<Component>,
  msg: NovelMessage<Component>,
) => ReturnModel<NovelModel<Component>, NovelMessage<Component>>;

export type Middleware<Component> = (
  model: NovelModel<Component>,
  msg: NovelMessage<Component>,
  next: MiddlewareNext<Component>,
) => ReturnModel<NovelModel<Component>, NovelMessage<Component>>;

export const update =
  <Component>(
    applyMixer: ApplyMixer,
    middlewares: Middleware<Component>[] = [],
  ) =>
  (
    model: NovelModel<Component>,
    msg: NovelMessage<Component>,
  ): ReturnModel<NovelModel<Component>, NovelMessage<Component>> => {
    const reducer: MiddlewareNext<Component> = (
      model: NovelModel<Component>,
      msg: NovelMessage<Component>,
    ) => {
      const updateWrapped = update<Component>(applyMixer, middlewares);

      switch (msg.type) {
        // General
        case 'Delay':
          return handleDelay(model, msg);
        case 'DelayCompleted':
          return handleDelayCompleted(model, msg);
        case 'Sequence':
          return handleSequence(model, msg, updateWrapped);
        case 'UpdateConfig':
          return handleUpdateConfig(model, msg);
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
          return handleChangeChannelVolume(
            model,
            msg,
            updateWrapped,
            applyMixer,
          );
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

    if (middlewares.length === 0) {
      return reducer(model, msg);
    }

    const composeMiddlewares = middlewares.reduceRight<
      MiddlewareNext<Component>
    >((next, cur) => {
      return (model, msg) => cur(model, msg, next);
    }, reducer);

    return composeMiddlewares(model, msg);
  };
