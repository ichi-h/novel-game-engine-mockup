import { describe, expect, test } from 'bun:test';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import type { ErrorMessage } from '@/update/message-handlers/general/error';
import {
  applyMixer,
  type ApplyMixerCompletedMessage,
  type ApplyMixerMessage,
  handleApplyMixer,
  handleApplyMixerCompleted,
} from '../apply-mixer';

describe('applyMixer', () => {
  describe('normal cases', () => {
    test('creates message with correct type', () => {
      // Act
      const message = applyMixer();

      // Assert
      expect(message.type).toBe('ApplyMixer');
    });
  });
});

describe('handleApplyMixer', () => {
  describe('normal cases', () => {
    test('sets isApplyingMixer to true and returns command', async () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      const message: ApplyMixerMessage = {
        type: 'ApplyMixer',
      };
      let mixerApplied = false;
      const mockApplyMixer = async () => {
        mixerApplied = true;
      };

      // Act
      const result = handleApplyMixer(model, message, mockApplyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        const [updatedModel, cmd] = result;
        expect(updatedModel.isApplyingMixer).toBe(true);
        expect(cmd).toBeDefined();
        expect(typeof cmd).toBe('function');

        // Execute the command and verify it completes successfully
        if (cmd) {
          const completedMessage = await cmd();
          expect(completedMessage.type).toBe('ApplyMixerCompleted');
          if (completedMessage.type === 'ApplyMixerCompleted') {
            expect(completedMessage.error).toBeNull();
          }
          expect(mixerApplied).toBe(true);
        }
      }
    });

    test('handles error in applyMixer function', async () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      const message: ApplyMixerMessage = {
        type: 'ApplyMixer',
      };
      const testError = new Error('Failed to apply mixer');
      const mockApplyMixer = async () => {
        throw testError;
      };

      // Act
      const result = handleApplyMixer(model, message, mockApplyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        const [updatedModel, cmd] = result;
        expect(updatedModel.isApplyingMixer).toBe(true);
        expect(cmd).toBeDefined();

        // Execute the command and verify it returns error
        if (cmd) {
          const completedMessage = await cmd();
          expect(completedMessage.type).toBe('ApplyMixerCompleted');
          if (completedMessage.type === 'ApplyMixerCompleted') {
            expect(completedMessage.error).toBe(testError);
            expect(completedMessage.error?.message).toBe(
              'Failed to apply mixer',
            );
          }
        }
      }
    });

    test('handles non-Error exceptions by converting to Error', async () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      const message: ApplyMixerMessage = {
        type: 'ApplyMixer',
      };
      const mockApplyMixer = async () => {
        throw 'string error';
      };

      // Act
      const result = handleApplyMixer(model, message, mockApplyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        const [_updatedModel, cmd] = result;

        // Execute the command and verify error is converted
        if (cmd) {
          const completedMessage = await cmd();
          expect(completedMessage.type).toBe('ApplyMixerCompleted');
          if (completedMessage.type === 'ApplyMixerCompleted') {
            expect(completedMessage.error).toBeInstanceOf(Error);
            expect(completedMessage.error?.message).toBe('string error');
          }
        }
      }
    });
  });
});

describe('handleApplyMixerCompleted', () => {
  describe('normal cases', () => {
    test('updates model with isApplyingMixer set to false when error is null', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.isApplyingMixer = true;
      const message: ApplyMixerCompletedMessage = {
        type: 'ApplyMixerCompleted',
        error: null,
      };
      const update = () => model;

      // Act
      const result = handleApplyMixerCompleted(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(false);
      if (!Array.isArray(result)) {
        expect(result.isApplyingMixer).toBe(false);
        expect(result.status.value).not.toBe('Error');
      }
    });

    test('dispatches Error message when error is not null', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.isApplyingMixer = true;
      const testError = new Error('Test mixer error');
      const message: ApplyMixerCompletedMessage = {
        type: 'ApplyMixerCompleted',
        error: testError,
      };
      let capturedMessage: NovelMessage | undefined;
      let capturedModel: NovelModel | undefined;
      const update = (_model: NovelModel, msg: NovelMessage) => {
        capturedModel = _model;
        capturedMessage = msg;
        return _model;
      };

      // Act
      const result = handleApplyMixerCompleted(model, message, update);

      // Assert
      expect(capturedModel).toBeDefined();
      expect(capturedModel?.isApplyingMixer).toBe(false);
      expect(capturedMessage).toBeDefined();
      expect(capturedMessage?.type).toBe('Error');
      if (capturedMessage?.type === 'Error') {
        const errorMsg = capturedMessage as ErrorMessage;
        expect(errorMsg.value).toBe(testError);
        expect(errorMsg.value.message).toBe('Test mixer error');
      }
      if (capturedModel) {
        expect(result).toBe(capturedModel);
      }
    });
  });
});
