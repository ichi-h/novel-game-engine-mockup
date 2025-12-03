import { describe, expect, test } from 'bun:test';
import { defaultConfig, generateInitModel } from '@/model';
import {
  handleUpdateConfig,
  type UpdateConfigMessage,
  updateConfig,
} from '../update-config';

describe('updateConfig', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange

      // Act
      const result = updateConfig(defaultConfig);

      // Assert
      expect(result).toEqual({
        type: 'UpdateConfig',
        config: defaultConfig,
      });
    });
  });
});

describe('handleUpdateConfig', () => {
  describe('normal cases', () => {
    test('updates model config with new config', () => {
      // Arrange
      const model = generateInitModel();
      const newConfig = {
        ...defaultConfig,
        historyLength: {
          ...defaultConfig.historyLength,
          Delay: 30,
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
