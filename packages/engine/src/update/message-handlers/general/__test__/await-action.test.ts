import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import {
  type AwaitActionMessage,
  awaitAction,
  handleAwaitAction,
} from '../await-action';

describe('awaitAction', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange & Act
      const result = awaitAction();

      // Assert
      expect(result).toEqual({
        type: 'AwaitAction',
      });
    });
  });
});

describe('handleAwaitAction', () => {
  describe('normal cases', () => {
    test('sets status to AwaitingAction', () => {
      // Arrange
      const model = generateInitModel();
      const msg: AwaitActionMessage = { type: 'AwaitAction' };

      // Act
      const result = handleAwaitAction(model, msg);

      // Assert
      expect(result.status).toEqual({ value: 'AwaitingAction' });
    });

    test('returns a new model object', () => {
      // Arrange
      const model = generateInitModel();
      const msg: AwaitActionMessage = { type: 'AwaitAction' };

      // Act
      const result = handleAwaitAction(model, msg);

      // Assert
      expect(result).not.toBe(model);
    });

    test('preserves other model properties', () => {
      // Arrange
      const model = generateInitModel();
      const msg: AwaitActionMessage = { type: 'AwaitAction' };

      // Act
      const result = handleAwaitAction(model, msg);

      // Assert
      expect(result.ui).toBe(model.ui);
      expect(result.config).toBe(model.config);
      expect(result.mixer).toBe(model.mixer);
    });

    test('is idempotent - calling multiple times has the same effect', () => {
      // Arrange
      const model = generateInitModel();
      const msg: AwaitActionMessage = { type: 'AwaitAction' };

      // Act
      const result1 = handleAwaitAction(model, msg);
      const result2 = handleAwaitAction(result1, msg);

      // Assert
      expect(result1.status).toEqual({ value: 'AwaitingAction' });
      expect(result2.status).toEqual({ value: 'AwaitingAction' });
    });
  });
});
