import { describe, expect, test } from 'bun:test';
import type { Cmd, Update } from '@ichi-h/elmish';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { handleNext, type NextMessage } from '../next';

describe('handleNext', () => {
  describe('normal cases', () => {
    test('processes message when update returns tuple with model and command', () => {
      // Arrange
      const model = generateInitModel();
      const initialIndex = model.index;

      const innerMessage: NovelMessage = {
        type: 'ShowText',
        textBoxId: 'box1',
        content: 'Hello',
      };

      const msg: NextMessage = {
        type: 'Next',
        message: innerMessage,
      };

      const mockMessage: NovelMessage = {
        type: 'ShowText',
        textBoxId: 'box1',
        content: 'Test',
      };
      const mockCmd: Cmd<NovelMessage> = () => Promise.resolve(mockMessage);
      const updatedModel: NovelModel = {
        ...model,
        currentScenario: 'updated',
      };

      const mockUpdate: Update<NovelModel, NovelMessage> = (_m, _msg) => [
        updatedModel,
        mockCmd,
      ];

      // Act
      const result = handleNext(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (!Array.isArray(result)) return;

      const [newModel, cmd] = result;
      expect(newModel.index).toBe(initialIndex + 1);
      expect(newModel.currentScenario).toBe('updated');
      expect(cmd).toBe(mockCmd);
    });

    test('processes message when update returns only model', () => {
      // Arrange
      const model = generateInitModel();
      const initialIndex = model.index;

      const innerMessage: NovelMessage = {
        type: 'ShowText',
        textBoxId: 'box1',
        content: 'Hello',
      };

      const msg: NextMessage = {
        type: 'Next',
        message: innerMessage,
      };

      const updatedModel: NovelModel = {
        ...model,
        currentScenario: 'updated',
      };

      const mockUpdate: Update<NovelModel, NovelMessage> = (_m, _msg) =>
        updatedModel;

      // Act
      const result = handleNext(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (!Array.isArray(result)) return;

      const [newModel, cmd] = result;
      expect(newModel.index).toBe(initialIndex + 1);
      expect(newModel.currentScenario).toBe('updated');
      expect(cmd).toBeUndefined();
    });

    test('preserves other model properties when incrementing index', () => {
      // Arrange
      const model: NovelModel = {
        ...generateInitModel(),
        status: { value: 'Processed' },
        currentScenario: 'scene1',
        index: 5,
        ui: [
          {
            id: 'box1',
            type: 'TextBox',
            children: [],
          },
        ],
      };

      const innerMessage: NovelMessage = {
        type: 'Delay',
        durationMs: 100,
      };

      const msg: NextMessage = {
        type: 'Next',
        message: innerMessage,
      };

      const updatedModel: NovelModel = {
        ...model,
        status: { value: 'Delaying', remainingTime: 100 },
      };

      const mockUpdate: Update<NovelModel, NovelMessage> = (_m, _msg) =>
        updatedModel;

      // Act
      const result = handleNext(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (!Array.isArray(result)) return;

      const [newModel, _cmd] = result;
      expect(newModel.index).toBe(6);
      expect(newModel.status).toEqual({
        value: 'Delaying',
        remainingTime: 100,
      });
      expect(newModel.currentScenario).toBe('scene1');
      expect(newModel.ui).toEqual(model.ui);
    });

    test('increments index correctly from zero', () => {
      // Arrange
      const model: NovelModel = {
        ...generateInitModel(),
        index: 0,
      };

      const innerMessage: NovelMessage = {
        type: 'ShowText',
        textBoxId: 'box1',
        content: 'Test',
      };

      const msg: NextMessage = {
        type: 'Next',
        message: innerMessage,
      };

      const mockUpdate: Update<NovelModel, NovelMessage> = (m, _msg) => m;

      // Act
      const result = handleNext(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (!Array.isArray(result)) return;

      const [newModel, _cmd] = result;
      expect(newModel.index).toBe(1);
    });

    test('increments index correctly from non-zero value', () => {
      // Arrange
      const model: NovelModel = {
        ...generateInitModel(),
        index: 5,
      };

      const innerMessage: NovelMessage = {
        type: 'ShowText',
        textBoxId: 'box1',
        content: 'Test',
      };

      const msg: NextMessage = {
        type: 'Next',
        message: innerMessage,
      };

      const mockUpdate: Update<NovelModel, NovelMessage> = (m, _msg) => m;

      // Act
      const result = handleNext(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (!Array.isArray(result)) return;

      const [newModel, _cmd] = result;
      expect(newModel.index).toBe(6);
    });
  });
});
