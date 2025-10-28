import { describe, expect, mock, test } from 'bun:test';
import type { ApplyMixer, BusTrack } from '@/mixer-v2';
import * as mixerModule from '@/mixer-v2';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import type { ErrorMessage } from '@/update/message-handlers/general/error';
import {
  type AddBusTrackMessage,
  addBusTrack,
  handleAddBusTrack,
} from '../add-bus-track';

describe('addBusTrack', () => {
  describe('normal cases', () => {
    test('creates message with only required parameter', () => {
      // Arrange
      const id = 'bus-track-1';

      // Act
      const message = addBusTrack(id);

      // Assert
      expect(message.type).toBe('AddBusTrack');
      expect(message.id).toBe(id);
      expect(message.volume).toBeUndefined();
      expect(message.parentBusTrackId).toBeUndefined();
    });

    test('creates message with all parameters', () => {
      // Arrange
      const id = 'bus-track-1';
      const volume = 0.8;
      const parentBusTrackId = 'parent-bus-track';

      // Act
      const message = addBusTrack(id, volume, parentBusTrackId);

      // Assert
      expect(message.type).toBe('AddBusTrack');
      expect(message.id).toBe(id);
      expect(message.volume).toBe(volume);
      expect(message.parentBusTrackId).toBe(parentBusTrackId);
    });
  });
});

describe('handleAddBusTrack', () => {
  describe('normal cases', () => {
    test('adds BusTrack to mixer root level with default volume', () => {
      // Arrange
      const model: NovelModel<string> = generateInitModel();
      const message: AddBusTrackMessage = {
        type: 'AddBusTrack',
        id: 'bus-track-1',
      };
      const update = () => model;
      const applyMixer: ApplyMixer = async () => {};

      // Act
      const result = handleAddBusTrack(model, message, update, applyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.channels).toHaveLength(1);
      expect(updatedModel.mixer.channels[0]).toEqual({
        id: 'bus-track-1',
        type: 'BusTrack',
        volume: 1.0,
        channels: [],
      });
      expect(updatedModel.isApplyingMixer).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('adds BusTrack with all parameters (custom volume and parent BusTrack)', () => {
      // Arrange
      const parentBusTrack: BusTrack = {
        id: 'parent-bus-track',
        type: 'BusTrack',
        volume: 1.0,
        channels: [],
      };
      const model: NovelModel<string> = generateInitModel();
      model.mixer.channels = [parentBusTrack];
      const message: AddBusTrackMessage = {
        type: 'AddBusTrack',
        id: 'child-bus-track',
        volume: 0.7,
        parentBusTrackId: 'parent-bus-track',
      };
      const update = () => model;
      const applyMixer: ApplyMixer = async () => {};

      // Act
      const result = handleAddBusTrack(model, message, update, applyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.channels).toHaveLength(1);
      const parent = updatedModel.mixer.channels[0];
      expect(parent).toBeDefined();
      if (parent) {
        expect(parent.type).toBe('BusTrack');
        if (parent.type === 'BusTrack') {
          expect(parent.id).toBe('parent-bus-track');
          expect(parent.channels).toHaveLength(1);
          expect(parent.channels[0]).toEqual({
            id: 'child-bus-track',
            type: 'BusTrack',
            volume: 0.7,
            channels: [],
          });
        }
      }
      expect(updatedModel.isApplyingMixer).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });
  });

  describe('error cases', () => {
    test('handles error when adding BusTrack with duplicate ID', () => {
      // Arrange
      const existingBusTrack: BusTrack = {
        id: 'bus-track-1',
        type: 'BusTrack',
        volume: 1.0,
        channels: [],
      };
      const model: NovelModel<string> = generateInitModel();
      model.mixer.channels = [existingBusTrack];
      const message: AddBusTrackMessage = {
        type: 'AddBusTrack',
        id: 'bus-track-1', // Duplicate ID
      };
      let errorMessage: string | null = null;
      const update = (
        _model: NovelModel<string>,
        msg: NovelMessage<string>,
      ) => {
        if (msg.type === 'Error') {
          errorMessage = (msg as ErrorMessage).value.message;
        }
        return _model;
      };
      const applyMixer: ApplyMixer = async () => {};

      // Act
      handleAddBusTrack(model, message, update, applyMixer);

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(String(errorMessage)).toContain(
        'Channel with ID bus-track-1 already exists in mixer',
      );
    });

    test('handles error when parentBusTrackId does not exist', () => {
      // Arrange
      const model: NovelModel<string> = generateInitModel();
      const message: AddBusTrackMessage = {
        type: 'AddBusTrack',
        id: 'bus-track-1',
        parentBusTrackId: 'non-existent-parent',
      };
      let errorMessage: string | null = null;
      const update = (
        _model: NovelModel<string>,
        msg: NovelMessage<string>,
      ) => {
        if (msg.type === 'Error') {
          errorMessage = (msg as ErrorMessage).value.message;
        }
        return _model;
      };
      const applyMixer: ApplyMixer = async () => {};

      // Act
      handleAddBusTrack(model, message, update, applyMixer);

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(String(errorMessage)).toContain(
        'Parent BusTrack with ID non-existent-parent does not exist in mixer',
      );
    });

    test('handles unknown error when adding BusTrack', () => {
      // Arrange
      const model: NovelModel<string> = generateInitModel();
      const message: AddBusTrackMessage = {
        type: 'AddBusTrack',
        id: 'track-1',
      };
      let errorMessage: string | null = null;
      const update = (
        _model: NovelModel<string>,
        msg: NovelMessage<string>,
      ) => {
        if (msg.type === 'Error') {
          errorMessage = (msg as ErrorMessage).value.message;
        }
        return _model;
      };
      const applyMixer: ApplyMixer = async () => {};

      // Mock addChannel to throw a non-Error object
      const originalAddChannelToMixer = mixerModule.addChannel;
      mock.module('@/mixer-v2', () => ({
        ...mixerModule,
        addChannel: () => {
          throw 'string error'; // Throw a non-Error object
        },
      }));

      // Act
      handleAddBusTrack(model, message, update, applyMixer);

      // Restore
      mock.module('@/mixer-v2', () => ({
        ...mixerModule,
        addChannel: originalAddChannelToMixer,
      }));

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(String(errorMessage)).toContain(
        'Unknown error occurred while adding BusTrack',
      );
    });
  });
});
