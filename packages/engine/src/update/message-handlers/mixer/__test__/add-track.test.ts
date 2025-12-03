import { describe, expect, test, mock } from 'bun:test';
import type { BusTrack } from '@/mixer';
import * as mixerModule from '@/mixer';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import type { ErrorMessage } from '@/update/message-handlers/general/error';
import { type AddTrackMessage, addTrack, handleAddTrack } from '../add-track';
import { handleApplyMixer } from '../apply-mixer';

describe('addTrack', () => {
  describe('normal cases', () => {
    test('creates message with only required parameters', () => {
      // Arrange
      const id = 'track-1';
      const src = 'audio/bgm.mp3';

      // Act
      const message = addTrack(id, src);

      // Assert
      expect(message.type).toBe('AddTrack');
      expect(message.id).toBe(id);
      expect(message.src).toBe(src);
      expect(message.busTrackId).toBeUndefined();
      expect(message.volume).toBeUndefined();
      expect(message.loop).toBeUndefined();
    });

    test('creates message with all parameters', () => {
      // Arrange
      const id = 'track-1';
      const src = 'audio/bgm.mp3';
      const busTrackId = 'bus-track-1';
      const volume = 0.8;
      const loop = { start: 0, end: 44100 };

      // Act
      const message = addTrack(id, src, busTrackId, volume, loop);

      // Assert
      expect(message.type).toBe('AddTrack');
      expect(message.id).toBe(id);
      expect(message.src).toBe(src);
      expect(message.busTrackId).toBe(busTrackId);
      expect(message.volume).toBe(volume);
      expect(message.loop).toEqual(loop);
    });
  });
});

describe('handleAddTrack', () => {
  describe('normal cases', () => {
    test('adds Track to mixer root level with default volume', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      const message: AddTrackMessage = {
        type: 'AddTrack',
        id: 'track-1',
        src: 'audio/bgm.mp3',
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleAddTrack(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.channels).toHaveLength(1);
      expect(updatedModel.mixer.value.channels[0]).toEqual({
        id: 'track-1',
        type: 'Track',
        playStatus: 'Standby',
        volume: 1.0,
        src: 'audio/bgm.mp3',
      });
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('adds Track with all parameters (custom volume, loop, and parent BusTrack)', () => {
      // Arrange
      const parentBusTrack: BusTrack = {
        id: 'parent-bus-track',
        type: 'BusTrack',
        volume: 1.0,
        channels: [],
      };
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [parentBusTrack];
      const message: AddTrackMessage = {
        type: 'AddTrack',
        id: 'track-1',
        src: 'audio/bgm.mp3',
        busTrackId: 'parent-bus-track',
        volume: 0.7,
        loop: { start: 0, end: 44100 },
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleAddTrack(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.channels).toHaveLength(1);
      const parent = updatedModel.mixer.value.channels[0];
      expect(parent).toBeDefined();
      if (parent) {
        expect(parent.type).toBe('BusTrack');
        if (parent.type === 'BusTrack') {
          expect(parent.id).toBe('parent-bus-track');
          expect(parent.channels).toHaveLength(1);
          expect(parent.channels[0]).toEqual({
            id: 'track-1',
            type: 'Track',
            playStatus: 'Standby',
            volume: 0.7,
            src: 'audio/bgm.mp3',
            isLoop: { start: 0, end: 44100 },
          });
        }
      }
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });
  });

  describe('error cases', () => {
    test('handles error when adding Track with duplicate ID', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [
        {
          id: 'track-1',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/existing.mp3',
        },
      ];
      const message: AddTrackMessage = {
        type: 'AddTrack',
        id: 'track-1', // Duplicate ID
        src: 'audio/bgm.mp3',
      };
      let errorMessage: string | null = null;
      const update = (_model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'Error') {
          errorMessage = (msg as ErrorMessage).value.message;
        }
        return _model;
      };

      // Act
      handleAddTrack(model, message, update);

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(String(errorMessage)).toContain(
        'Channel with ID track-1 already exists in mixer',
      );
    });

    test('handles error when busTrackId does not exist', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      const message: AddTrackMessage = {
        type: 'AddTrack',
        id: 'track-1',
        src: 'audio/bgm.mp3',
        busTrackId: 'non-existent-bus-track',
      };
      let errorMessage: string | null = null;
      const update = (_model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'Error') {
          errorMessage = (msg as ErrorMessage).value.message;
        }
        return _model;
      };

      // Act
      handleAddTrack(model, message, update);

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(String(errorMessage)).toContain(
        'Parent BusTrack with ID non-existent-bus-track does not exist in mixer',
      );
    });

    test('handles unknown error when adding Track', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      const message: AddTrackMessage = {
        type: 'AddTrack',
        id: 'track-1',
        src: 'audio/bgm.mp3',
      };
      let errorMessage: string | null = null;
      const update = (_model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'Error') {
          errorMessage = (msg as ErrorMessage).value.message;
        }
        return _model;
      };

      // Mock addChannel to throw a non-Error object
      const originalAddChannelToMixer = mixerModule.addChannel;
      mock.module('@/mixer', () => ({
        ...mixerModule,
        addChannel: () => {
          throw 'string error'; // Throw a non-Error object
        },
      }));

      // Act
      handleAddTrack(model, message, update);

      // Restore
      mock.module('@/mixer', () => ({
        ...mixerModule,
        addChannel: originalAddChannelToMixer,
      }));

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(String(errorMessage)).toContain(
        'Unknown error occurred while adding Track',
      );
    });
  });
});
