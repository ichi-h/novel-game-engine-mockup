import { describe, expect, test } from 'bun:test';
import type { BusTrack } from '@/mixer';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { handleApplyMixer } from '../apply-mixer';
import {
  handleRemoveChannel,
  type RemoveChannelMessage,
  removeChannel,
} from '../remove-channel';

describe('removeChannel', () => {
  describe('normal cases', () => {
    test('creates message with required parameters', () => {
      // Arrange
      const channelId = 'channel-1';

      // Act
      const message = removeChannel(channelId);

      // Assert
      expect(message.type).toBe('RemoveChannel');
      expect(message.channelId).toBe(channelId);
    });
  });
});

describe('handleRemoveChannel', () => {
  describe('normal cases', () => {
    test('removes track from mixer root level', () => {
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
      const message: RemoveChannelMessage = {
        type: 'RemoveChannel',
        channelId: 'track-2',
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleRemoveChannel(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.channels).toHaveLength(2);
      expect(updatedModel.mixer.value.channels[0]?.id).toBe('track-1');
      expect(updatedModel.mixer.value.channels[1]?.id).toBe('track-3');
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('removes bus track and all its child channels from mixer', () => {
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
            src: 'audio/bgm1.mp3',
          },
          {
            id: 'track-2',
            type: 'Track',
            playStatus: 'Playing',
            volume: 0.5,
            src: 'audio/bgm2.mp3',
          },
        ],
      };
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [
        busTrack,
        {
          id: 'track-3',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/bgm3.mp3',
        },
      ];
      const message: RemoveChannelMessage = {
        type: 'RemoveChannel',
        channelId: 'bus-track-1',
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleRemoveChannel(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.channels).toHaveLength(1);
      expect(updatedModel.mixer.value.channels[0]?.id).toBe('track-3');
      // Verify that child channels (track-1 and track-2) are also removed
      const hasTrack1 = updatedModel.mixer.value.channels.some(
        (c) => c.id === 'track-1',
      );
      const hasTrack2 = updatedModel.mixer.value.channels.some(
        (c) => c.id === 'track-2',
      );
      expect(hasTrack1).toBe(false);
      expect(hasTrack2).toBe(false);
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('removes track inside bus track', () => {
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
            src: 'audio/bgm1.mp3',
          },
          {
            id: 'track-2',
            type: 'Track',
            playStatus: 'Playing',
            volume: 0.5,
            src: 'audio/bgm2.mp3',
          },
        ],
      };
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [busTrack];
      const message: RemoveChannelMessage = {
        type: 'RemoveChannel',
        channelId: 'track-1',
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleRemoveChannel(model, message, update);

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
        expect(updatedBusTrack.channels[0]?.id).toBe('track-2');
      }
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('removes track from nested bus track', () => {
      // Arrange
      const nestedBusTrack: BusTrack = {
        id: 'nested-bus-track',
        type: 'BusTrack',
        volume: 0.9,
        channels: [
          {
            id: 'nested-track',
            type: 'Track',
            playStatus: 'Playing',
            volume: 0.6,
            src: 'audio/nested.mp3',
          },
        ],
      };
      const parentBusTrack: BusTrack = {
        id: 'parent-bus-track',
        type: 'BusTrack',
        volume: 1.0,
        channels: [nestedBusTrack],
      };
      const model: NovelModel = generateInitModel();
      model.mixer.value.channels = [parentBusTrack];
      const message: RemoveChannelMessage = {
        type: 'RemoveChannel',
        channelId: 'nested-track',
      };
      const mockApplyMixer = async () => {};
      const update = (model: NovelModel, msg: NovelMessage) => {
        if (msg.type === 'ApplyMixer') {
          return handleApplyMixer(model, msg, mockApplyMixer);
        }
        return model;
      };

      // Act
      const result = handleRemoveChannel(model, message, update);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.value.channels).toHaveLength(1);
      const parentBus = updatedModel.mixer.value.channels[0];
      expect(parentBus).toBeDefined();
      if (parentBus && parentBus.type === 'BusTrack') {
        expect(parentBus.channels).toHaveLength(1);
        const childBus = parentBus.channels[0];
        if (childBus && childBus.type === 'BusTrack') {
          expect(childBus.channels).toHaveLength(0);
        }
      }
      expect(updatedModel.mixer.isApplying).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });
  });
});
