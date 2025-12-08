import { describe, expect, test } from 'bun:test';
import { generateInitModel, type NovelModel } from '@ichi-h/tsuzuri-core';
import {
  deserializeModel,
  type SerializedError,
  type SerializedNovelModel,
  serializeModel,
} from '../serialization';

const createBaseModel = (): Omit<NovelModel, 'status'> => {
  const { status: _, ...baseModel } = generateInitModel();
  return baseModel;
};

describe('serialization', () => {
  describe('serializeModel', () => {
    describe('normal cases', () => {
      test('serializes model with Processed status unchanged', () => {
        // Arrange
        const model: NovelModel = {
          ...createBaseModel(),
          status: { value: 'Processed' },
        };

        // Act
        const result = serializeModel(model);

        // Assert
        expect(result.status).toEqual({ value: 'Processed' });
      });

      test('serializes model with Inserted status unchanged', () => {
        // Arrange
        const message = { type: 'Delay' as const, durationMs: 1000 };
        const before = { type: 'DelayCompleted' as const };
        const model: NovelModel = {
          ...createBaseModel(),
          status: { value: 'Inserted', message, before },
        };

        // Act
        const result = serializeModel(model);

        // Assert
        expect(result.status).toEqual({ value: 'Inserted', message, before });
      });

      test('serializes model with Error status by converting Error to plain object', () => {
        // Arrange
        const error = new Error('Test error');
        error.name = 'TestError';
        const model: NovelModel = {
          ...createBaseModel(),
          status: { value: 'Error', error },
        };

        // Act
        const result = serializeModel(model);

        // Assert
        expect(result.status.value).toBe('Error');
        const serializedError = (
          result.status as { value: 'Error'; error: SerializedError }
        ).error;
        expect(serializedError.name).toBe('TestError');
        expect(serializedError.message).toBe('Test error');
        expect(typeof serializedError.stack).toBe('string');
      });
    });
  });

  describe('deserializeModel', () => {
    describe('normal cases', () => {
      test('deserializes model with Processed status unchanged', () => {
        // Arrange
        const serialized: SerializedNovelModel = {
          ...createBaseModel(),
          status: { value: 'Processed' },
        };

        // Act
        const result = deserializeModel(serialized);

        // Assert
        expect(result.status).toEqual({ value: 'Processed' });
      });

      test('deserializes model with Inserted status unchanged', () => {
        // Arrange
        const message = { type: 'Delay' as const, durationMs: 1000 };
        const before = { type: 'DelayCompleted' as const };
        const serialized: SerializedNovelModel = {
          ...createBaseModel(),
          status: { value: 'Inserted', message, before },
        };

        // Act
        const result = deserializeModel(serialized);

        // Assert
        expect(result.status).toEqual({ value: 'Inserted', message, before });
      });

      test('deserializes model with Error status by reconstructing Error instance', () => {
        // Arrange
        const serialized: SerializedNovelModel = {
          ...createBaseModel(),
          status: {
            value: 'Error',
            error: {
              name: 'TestError',
              message: 'Test error',
              stack: 'Error: Test error\n    at test.ts:1:1',
            },
          },
        };

        // Act
        const result = deserializeModel(serialized);

        // Assert
        expect(result.status.value).toBe('Error');
        const error = (result.status as { value: 'Error'; error: Error }).error;
        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('TestError');
        expect(error.message).toBe('Test error');
        expect(error.stack).toBe('Error: Test error\n    at test.ts:1:1');
      });
    });
  });

  describe('round-trip', () => {
    test('serialize and deserialize preserves model data for Processed status', () => {
      // Arrange
      const model: NovelModel = {
        ...createBaseModel(),
        status: { value: 'Processed' },
      };

      // Act
      const serialized = serializeModel(model);
      const deserialized = deserializeModel(serialized);

      // Assert
      expect(deserialized).toEqual(model);
    });

    test('serialize and deserialize preserves Error status with reconstructed Error instance', () => {
      // Arrange
      const error = new Error('Test error');
      error.name = 'CustomError';
      const model: NovelModel = {
        ...createBaseModel(),
        status: { value: 'Error', error },
      };

      // Act
      const serialized = serializeModel(model);
      const deserialized = deserializeModel(serialized);

      // Assert
      expect(deserialized.status.value).toBe('Error');
      const deserializedError = (
        deserialized.status as { value: 'Error'; error: Error }
      ).error;
      expect(deserializedError).toBeInstanceOf(Error);
      expect(deserializedError.name).toBe(error.name);
      expect(deserializedError.message).toBe(error.message);
    });
  });
});
