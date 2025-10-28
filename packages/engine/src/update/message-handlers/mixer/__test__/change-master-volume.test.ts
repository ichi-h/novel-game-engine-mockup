import { describe, expect, test } from 'bun:test';
import type { ApplyMixer } from '@/mixer';
import { generateInitModel, type NovelModel } from '@/model';
import {
  type ChangeMasterVolumeMessage,
  changeMasterVolume,
  handleChangeMasterVolume,
} from '../change-master-volume';

describe('changeMasterVolume', () => {
  describe('normal cases', () => {
    test('creates message with required parameters', () => {
      // Arrange
      const masterVolume = 0.5;

      // Act
      const message = changeMasterVolume(masterVolume);

      // Assert
      expect(message.type).toBe('ChangeMasterVolume');
      expect(message.masterVolume).toBe(masterVolume);
    });
  });
});

describe('handleChangeMasterVolume', () => {
  describe('normal cases', () => {
    test('updates master volume', () => {
      // Arrange
      const model: NovelModel<string> = generateInitModel();
      model.mixer.volume = 1.0;
      const message: ChangeMasterVolumeMessage = {
        type: 'ChangeMasterVolume',
        masterVolume: 0.7,
      };
      const applyMixer: ApplyMixer = async () => {};

      // Act
      const result = handleChangeMasterVolume(model, message, applyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.volume).toBe(0.7);
      expect(updatedModel.isApplyingMixer).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });
  });
});
