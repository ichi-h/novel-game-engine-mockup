import { describe, expect, test } from 'bun:test';
import { createDefaultConfig, generateInitModel } from '@/model';
import {
  handleUpdateConfig,
  type UpdateConfigMessage,
  updateConfig,
} from '../update-config';

describe('updateConfig', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange
      const config = createDefaultConfig();

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
      const model = generateInitModel();
      const defaultConfig = createDefaultConfig();
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
