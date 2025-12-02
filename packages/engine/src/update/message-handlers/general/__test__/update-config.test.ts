import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import {
  handleUpdateConfig,
  type UpdateConfigMessage,
  updateConfig,
} from '../update-config';

describe('updateConfig', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange
      const config = {
        historyLength: {
          Delay: 20,
          DelayCompleted: 20,
          Sequence: 20,
          Error: 300,
          RecoverError: 20,
          UpdateConfig: 20,
          AddLayout: 20,
          ShowImage: 20,
          AddWidgets: 20,
          AddTextBox: 300,
          ShowText: 20,
          TextAnimationCompleted: 20,
          ClearTextBox: 20,
          RemoveWidgets: 20,
          AddTrack: 20,
          AddBusTrack: 20,
          PlayChannel: 20,
          StopChannel: 20,
          ChangeMasterVolume: 20,
          ChangeChannelVolume: 20,
          RemoveChannel: 20,
          ApplyMixerCompleted: 20,
        },
        textAnimationSpeed: 75,
      };

      // Act
      const result = updateConfig(config);

      // Assert
      expect(result).toEqual({
        type: 'UpdateConfig',
        config,
      });
    });
  });
});

describe('handleUpdateConfig', () => {
  describe('normal cases', () => {
    test('updates model config with new config', () => {
      // Arrange
      const model = generateInitModel<string>();
      const newConfig = {
        historyLength: {
          Delay: 30,
          DelayCompleted: 30,
          Sequence: 30,
          Error: 400,
          RecoverError: 30,
          UpdateConfig: 30,
          AddLayout: 30,
          ShowImage: 30,
          AddWidgets: 30,
          AddTextBox: 400,
          ShowText: 30,
          TextAnimationCompleted: 30,
          ClearTextBox: 30,
          RemoveWidgets: 30,
          AddTrack: 30,
          AddBusTrack: 30,
          PlayChannel: 30,
          StopChannel: 30,
          ChangeMasterVolume: 30,
          ChangeChannelVolume: 30,
          RemoveChannel: 30,
          ApplyMixerCompleted: 30,
        },
        textAnimationSpeed: 80,
      };
      const msg: UpdateConfigMessage = {
        type: 'UpdateConfig',
        config: newConfig,
      };

      // Act
      const result = handleUpdateConfig(model, msg);

      // Assert
      expect(result.config).toEqual(newConfig);
      expect(result.config.historyLength.Delay).toBe(30);
      expect(result.config.textAnimationSpeed).toBe(80);
    });
  });
});
