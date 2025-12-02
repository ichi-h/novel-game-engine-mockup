import { describe, expect, test } from 'bun:test';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import type { ErrorMessage } from '@/update/message-handlers/general/error';
import {
  type ApplyMixerCompletedMessage,
  handleApplyMixerCompleted,
} from '../apply-mixer-completed';

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
