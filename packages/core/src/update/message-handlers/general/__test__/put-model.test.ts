import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { handlePutModel, type PutModelMessage, putModel } from '../put-model';

describe('putModel', () => {
  describe('normal cases', () => {
    test('creates message with given model', () => {
      // Arrange
      const model = generateInitModel();

      // Act
      const result = putModel(model);

      // Assert
      expect(result).toEqual({
        type: 'PutModel',
        model,
      });
    });
  });
});

describe('handlePutModel', () => {
  describe('normal cases', () => {
    test('works with custom state', () => {
      // Arrange
      interface CustomState {
        score: number;
        playerName: string;
      }
      const oldModel = generateInitModel<CustomState>();
      oldModel.customState = {
        score: 100,
        playerName: 'Alice',
      };

      const newModel = generateInitModel<CustomState>();
      newModel.index = 50;
      newModel.customState = {
        score: 200,
        playerName: 'Bob',
      };

      const msg: PutModelMessage<CustomState> = {
        type: 'PutModel',
        model: newModel,
      };

      // Act
      const result = handlePutModel(oldModel, msg);

      // Assert
      expect(result.index).toBe(50);
      expect(result.customState).toEqual({
        score: 200,
        playerName: 'Bob',
      });
    });

    test('does not modify original models', () => {
      // Arrange
      const oldModel = generateInitModel();
      oldModel.index = 10;
      oldModel.currentScenario = 'chapter1';

      const newModel = generateInitModel();
      newModel.index = 50;
      newModel.currentScenario = 'chapter2';

      const msg: PutModelMessage = {
        type: 'PutModel',
        model: newModel,
      };

      // Store original values
      const oldModelIndexBefore = oldModel.index;
      const oldModelScenarioBefore = oldModel.currentScenario;
      const newModelIndexBefore = newModel.index;
      const newModelScenarioBefore = newModel.currentScenario;

      // Act
      const result = handlePutModel(oldModel, msg);

      // Assert
      // Result has new model values
      expect(result.index).toBe(50);
      expect(result.currentScenario).toBe('chapter2');

      // Original models unchanged
      expect(oldModel.index).toBe(oldModelIndexBefore);
      expect(oldModel.currentScenario).toBe(oldModelScenarioBefore);
      expect(newModel.index).toBe(newModelIndexBefore);
      expect(newModel.currentScenario).toBe(newModelScenarioBefore);

      // Result is the new model (reference equality)
      expect(result).toBe(newModel);
    });
  });
});
