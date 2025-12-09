import type { ReturnModel } from '@ichi-h/elmish';
import type { ApplyMixer } from '@/mixer';
import type { NovelModel } from '../model';
import type { NovelMessage } from './message';
import { handleAwaitAction } from './message-handlers/general/await-action';
import {
  handleDelay,
  handleDelayCompleted,
} from './message-handlers/general/delay';
import {
  handleError,
  handleRecoverError,
} from './message-handlers/general/error';
import { handleNext } from './message-handlers/general/next';
import { handlePutModel } from './message-handlers/general/put-model';
import { handleResetProperties } from './message-handlers/general/reset-properties';
import { handleScheduleMessage } from './message-handlers/general/schedule';
import { handleSequence } from './message-handlers/general/sequence';
import { handleSwitchScenario } from './message-handlers/general/switch-scenario';
import { handleUpdateConfig } from './message-handlers/general/update-config';
import { handleUpdateCustomState } from './message-handlers/general/update-custom-state';
import { handleAddBusTrack } from './message-handlers/mixer/add-bus-track';
import { handleAddTrack } from './message-handlers/mixer/add-track';
import {
  handleApplyMixer,
  handleApplyMixerCompleted,
} from './message-handlers/mixer/apply-mixer';
import { handleChangeChannelVolume } from './message-handlers/mixer/change-channel-volume';
import { handleChangeMasterVolume } from './message-handlers/mixer/change-master-volume';
import { handlePlayChannel } from './message-handlers/mixer/play-channel';
import { handleRemoveChannel } from './message-handlers/mixer/remove-channel';
import { handleStopChannel } from './message-handlers/mixer/stop-channel';
import { handleAddButton } from './message-handlers/widgets/add-button';
import { handleAddImage } from './message-handlers/widgets/add-image';
import { handleAddLayout } from './message-handlers/widgets/add-layout';
import {
  handleAddText,
  handleTextAnimationCompleted,
} from './message-handlers/widgets/add-text';
import { handleAddTextBox } from './message-handlers/widgets/add-text-box';
import { handleAddWidgets } from './message-handlers/widgets/add-widgets';
import { handleClearTextBox } from './message-handlers/widgets/clear-text-box';
import { handleRemoveWidgets } from './message-handlers/widgets/remove-widgets';
import {
  builtInMiddlewares,
  type Middleware,
  type MiddlewareNext,
} from './middleware';

export const update =
  <CustomState = unknown>(
    applyMixer: ApplyMixer,
    middlewares: Middleware<CustomState>[] = [],
  ) =>
  (
    model: NovelModel<CustomState>,
    msg: NovelMessage<CustomState>,
  ): ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>> => {
    const reducer: MiddlewareNext<CustomState> = (
      model: NovelModel<CustomState>,
      msg: NovelMessage<CustomState>,
    ) => {
      const updateWrapped = update<CustomState>(applyMixer, []);

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
        case 'ScheduleMessage':
          return handleScheduleMessage(model, msg);
        case 'Sequence':
          return handleSequence(model, msg, updateWrapped);
        case 'UpdateConfig':
          return handleUpdateConfig(model, msg);
        case 'UpdateCustomState':
          return handleUpdateCustomState(model, msg);
        case 'ResetProperties':
          return handleResetProperties(model, msg);
        case 'PutModel':
          return handlePutModel(model, msg);
        case 'Error':
          return handleError(model, msg);
        case 'RecoverError':
          return handleRecoverError(model);

        // Widgets
        case 'AddLayout':
          return handleAddLayout(model, msg);
        case 'AddImage':
          return handleAddImage(model, msg);
        case 'AddButton':
          return handleAddButton(model, msg);
        case 'AddTextBox':
          return handleAddTextBox(model, msg);
        case 'AddText':
          return handleAddText(model, msg);
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

    const allMiddlewares = [...builtInMiddlewares, ...middlewares];

    const composeMiddlewares = allMiddlewares.reduceRight<
      MiddlewareNext<CustomState>
    >((next, cur) => {
      return (model, msg) => cur(model, msg, next);
    }, reducer);

    return composeMiddlewares(model, msg);
  };
