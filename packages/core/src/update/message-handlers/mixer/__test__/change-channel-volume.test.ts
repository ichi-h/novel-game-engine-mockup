import { describe, expect, test } from 'bun:test';
import type { BusTrack } from '@/mixer';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import type { ErrorMessage } from '@/update/message-handlers/general/error';
import { handleApplyMixer } from '../apply-mixer';
import {
  type ChangeChannelVolumeMessage,
  changeChannelVolume,
  handleChangeChannelVolume,
} from '../change-channel-volume';

describe('changeChannelVolume', () => {
  describe('normal cases', () => {
    test('creates message with required parameters', () => {
      // Arrange
      const channelId = 'channel-1';
      const volume = 0.5;

      // Act
      const message = changeChannelVolume({ channelId, volume });

      // Assert
      expect(message.type).toBe('ChangeChannelVolume');
      expect(message.channelId).toBe(channelId);
      expect(message.volume).toBe(volume);
    });
  });
});

describe('handleChangeChannelVolume', () => {
  describe('normal cases', () => {
    test('updates volume of specified channel', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [
        {
          id: 'track-1',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/bgm.mp3',
        },
      ];
      const message: ChangeChannelVolumeMessage = {
        type: 'ChangeChannelVolume',
        channelId: 'track-1',
        volume: 0.5,
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleChangeChannelVolume(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.channels).toHaveLength(1);
      expect(updatedModel.mixer.value.channels[0]?.volume).toBe(0.5);
      expect(updatedModel.mixer.value.channels[0]?.id).toBe('track-1');
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('updates only specified channel when multiple channels exist', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [
        {
          id: 'track-1',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/bgm1.mp3',
        },
        {
          id: 'track-2',
          type: 'Track',
          playStatus: 'Playing',
          volume: 0.8,
          src: 'audio/bgm2.mp3',
        },
        {
          id: 'track-3',
          type: 'Track',
          playStatus: 'Stopped',
          volume: 0.6,
          src: 'audio/bgm3.mp3',
        },
      ];
      const message: ChangeChannelVolumeMessage = {
        type: 'ChangeChannelVolume',
        channelId: 'track-2',
        volume: 0.3,
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleChangeChannelVolume(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.channels).toHaveLength(3);
      expect(updatedModel.mixer.value.channels[0]?.volume).toBe(1.0); // Unchanged
      expect(updatedModel.mixer.value.channels[1]?.volume).toBe(0.3); // Changed
      expect(updatedModel.mixer.value.channels[2]?.volume).toBe(0.6); // Unchanged
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('updates volume of Track inside BusTrack', () => {
      // Arrange
      const busTrack: BusTrack = {
        id: 'bus-track-1',
        type: 'BusTrack',
        volume: 1.0,
        channels: [
          {
            id: 'track-1',
            type: 'Track',
            playStatus: 'Standby',
            volume: 0.7,
            src: 'audio/bgm.mp3',
          },
        ],
      };
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [busTrack];
      const message: ChangeChannelVolumeMessage = {
        type: 'ChangeChannelVolume',
        channelId: 'track-1',
        volume: 0.4,
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleChangeChannelVolume(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.channels).toHaveLength(1);
      const updatedBusTrack = updatedModel.mixer.value.channels[0];
      expect(updatedBusTrack).toBeDefined();
      if (updatedBusTrack && updatedBusTrack.type === 'BusTrack') {
        expect(updatedBusTrack.channels).toHaveLength(1);
        expect(updatedBusTrack.channels[0]?.volume).toBe(0.4);
        expect(updatedBusTrack.channels[0]?.id).toBe('track-1');
      }
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });
  });

  describe('error cases', () => {
    test('handles error when channelId does not exist', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [
        {
          id: 'track-1',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/bgm.mp3',
        },
      ];
      const message: ChangeChannelVolumeMessage = {
        type: 'ChangeChannelVolume',
        channelId: 'non-existent-channel',
        volume: 0.5,
      };
      let errorMessage: string | null = null;
      const update = (_model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'Error') {
          errorMessage = (msg as ErrorMessage).value.message;
        }
        return _model;
      };

      // Act
      handleChangeChannelVolume(model, message, update);

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(String(errorMessage)).toContain(
        'Channel with ID non-existent-channel does not exist in the mixer',
      );
    });
  });
});
