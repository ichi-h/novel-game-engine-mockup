import { describe, expect, test } from 'bun:test';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { handleApplyMixer } from '../apply-mixer';
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
      const model: NovelModel = generateInitModel();
      model.mixer.value.volume = 1.0;
      const message: ChangeMasterVolumeMessage = {
        type: 'ChangeMasterVolume',
        masterVolume: 0.7,
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleChangeMasterVolume(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.volume).toBe(0.7);
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });
  });
});
