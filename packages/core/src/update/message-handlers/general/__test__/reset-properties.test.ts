import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import {
  handleResetProperties,
  type ResetPropertiesMessage,
  resetProperties,
} from '../reset-properties';

describe('resetProperties', () => {
  describe('normal cases', () => {
    test('creates message with single property', () => {
      // Arrange

      // Act
      const result = resetProperties(['status']);

      // Assert
      expect(result).toEqual({
        type: 'ResetProperties',
        properties: ['status'],
      });
    });

    test('creates message with multiple properties', () => {
      // Arrange

      // Act
      const result = resetProperties(['status', 'ui', 'mixer']);

      // Assert
      expect(result).toEqual({
        type: 'ResetProperties',
        properties: ['status', 'ui', 'mixer'],
      });
    });

    test('creates message with empty properties array', () => {
      // Arrange

      // Act
      const result = resetProperties([]);

      // Assert
      expect(result).toEqual({
        type: 'ResetProperties',
        properties: [],
      });
    });
  });
});

describe('handleResetProperties', () => {
  describe('normal cases', () => {
    test('resets single property to initial value', () => {
      // Arrange
      const model = generateInitModel();
      model.index = 100;
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: ['index'],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.index).toBe(0);
      expect(model.index).toBe(100); // Original model unchanged
    });

    test('resets multiple properties to initial values', () => {
      // Arrange
      const model = generateInitModel();
      model.index = 100;
      model.currentScenario = 'chapter2';
      model.ui = [{ id: 'test', type: 'Layout', children: [] }];
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: ['index', 'currentScenario', 'ui'],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.index).toBe(0);
      expect(result.currentScenario).toBe('main');
      expect(result.ui).toEqual([]);
      // Original model unchanged
      expect(model.index).toBe(100);
      expect(model.currentScenario).toBe('chapter2');
      expect(model.ui).toHaveLength(1);
    });

    test('does not affect non-specified properties', () => {
      // Arrange
      const model = generateInitModel();
      model.index = 100;
      model.currentScenario = 'chapter2';
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: ['index'],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.index).toBe(0);
      expect(result.currentScenario).toBe('chapter2'); // Not reset
    });

    test('resets status property correctly', () => {
      // Arrange
      const model = generateInitModel();
      model.status = { value: 'AwaitingAction' };
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: ['status'],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.status).toEqual({ value: 'Processed' });
    });

    test('resets mixer property correctly', () => {
      // Arrange
      const model = generateInitModel();
      model.mixer = {
        value: {
          volume: 0.5,
          channels: [
            {
              id: 'ch1',
              type: 'Track',
              playStatus: 'Playing',
              volume: 0.8,
              src: 'test.mp3',
            },
          ],
        },
        isApplying: true,
      };
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: ['mixer'],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.mixer).toEqual({
        value: { volume: 1, channels: [] },
        isApplying: false,
      });
    });

    test('resets history property correctly', () => {
      // Arrange
      const model = generateInitModel();
      model.history.Next = [{ type: 'Next', message: { type: 'AwaitAction' } }];
      model.history.Delay = [{ type: 'Delay', durationMs: 1000 }];
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: ['history'],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.history.Next).toEqual([]);
      expect(result.history.Delay).toEqual([]);
    });

    test('resets customState to undefined', () => {
      // Arrange
      type CustomState = { score: number };
      const model = generateInitModel<CustomState>({ score: 100 });
      const msg: ResetPropertiesMessage<CustomState> = {
        type: 'ResetProperties',
        properties: ['customState'],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.customState).toBeUndefined();
    });

    test('handles empty properties array', () => {
      // Arrange
      const model = generateInitModel();
      model.index = 100;
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: [],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.index).toBe(100); // No change
    });

    test('handles duplicate properties in array', () => {
      // Arrange
      const model = generateInitModel();
      model.index = 100;
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: ['index', 'index', 'index'],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      expect(result.index).toBe(0); // Reset only once
    });

    test('resets all properties when all are specified', () => {
      // Arrange
      const model = generateInitModel();
      model.index = 100;
      model.currentScenario = 'chapter2';
      model.status = { value: 'AwaitingAction' };
      const msg: ResetPropertiesMessage = {
        type: 'ResetProperties',
        properties: [
          'status',
          'currentScenario',
          'index',
          'mixer',
          'ui',
          'animationTickets',
          'history',
        ],
      };

      // Act
      const result = handleResetProperties(model, msg);

      // Assert
      const initModel = generateInitModel();
      expect(result.status).toEqual(initModel.status);
      expect(result.currentScenario).toBe(initModel.currentScenario);
      expect(result.index).toBe(initModel.index);
      expect(result.mixer).toEqual(initModel.mixer);
      expect(result.ui).toEqual(initModel.ui);
      expect(result.animationTickets).toEqual(initModel.animationTickets);
      expect(result.history).toEqual(initModel.history);
    });
  });
});
