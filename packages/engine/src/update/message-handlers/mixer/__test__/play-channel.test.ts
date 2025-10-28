import { describe, expect, test } from 'bun:test';
import type { ApplyMixer, BusTrack } from '@/mixer';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import type { ErrorMessage } from '@/update/message-handlers/general/error';
import {
  handlePlayChannel,
  type PlayChannelMessage,
  playChannel,
} from '../play-channel';

describe('playChannel', () => {
  describe('normal cases', () => {
    test('creates message with only required parameters', () => {
      // Arrange
      const channelId = 'channel-1';

      // Act
      const message = playChannel(channelId);

      // Assert
      expect(message.type).toBe('PlayChannel');
      expect(message.channelId).toBe(channelId);
      expect(message.delayMs).toBeUndefined();
      expect(message.offsetMs).toBeUndefined();
      expect(message.fadeInMs).toBeUndefined();
      expect(message.fadeOutMs).toBeUndefined();
    });

    test('creates message with all parameters', () => {
      // Arrange
      const channelId = 'channel-1';
      const delayMs = 100;
      const offsetMs = 200;
      const fadeInMs = 1000;
      const fadeOutMs = 2000;

      // Act
      const message = playChannel(
        channelId,
        delayMs,
        offsetMs,
        fadeInMs,
        fadeOutMs,
      );

      // Assert
      expect(message.type).toBe('PlayChannel');
      expect(message.channelId).toBe(channelId);
      expect(message.delayMs).toBe(delayMs);
      expect(message.offsetMs).toBe(offsetMs);
      expect(message.fadeInMs).toBe(fadeInMs);
      expect(message.fadeOutMs).toBe(fadeOutMs);
    });
  });
});

describe('handlePlayChannel', () => {
  describe('normal cases', () => {
    test('changes channel to playing status with only required parameters', () => {
      // Arrange
      const model: NovelModel<string> = generateInitModel();
      model.mixer.channels = [
        {
          id: 'channel-1',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/bgm.mp3',
        },
      ];
      const message: PlayChannelMessage = {
        type: 'PlayChannel',
        channelId: 'channel-1',
      };
      const update = () => model;
      const applyMixer: ApplyMixer = async () => {};

      // Act
      const result = handlePlayChannel(model, message, update, applyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.channels).toHaveLength(1);
      const channel = updatedModel.mixer.channels[0];
      expect(channel?.id).toBe('channel-1');
      expect(channel?.type).toBe('Track');
      if (channel?.type === 'Track') {
        expect(channel.playStatus).toBe('Playing');
        expect(channel.volume).toBe(1.0);
        expect(channel).not.toHaveProperty('fadeInMs');
        expect(channel).not.toHaveProperty('fadeOutMs');
        expect(channel).not.toHaveProperty('delayMs');
        expect(channel).not.toHaveProperty('offsetMs');
      }
      expect(updatedModel.isApplyingMixer).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('changes channel to playing status with all optional parameters', () => {
      // Arrange
      const model: NovelModel<string> = generateInitModel();
      model.mixer.channels = [
        {
          id: 'channel-1',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/bgm.mp3',
        },
      ];
      const message: PlayChannelMessage = {
        type: 'PlayChannel',
        channelId: 'channel-1',
        fadeInMs: 1000,
        fadeOutMs: 2000,
        delayMs: 100,
        offsetMs: 200,
      };
      const update = () => model;
      const applyMixer: ApplyMixer = async () => {};

      // Act
      const result = handlePlayChannel(model, message, update, applyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.channels).toHaveLength(1);
      const channel = updatedModel.mixer.channels[0];
      expect(channel?.id).toBe('channel-1');
      expect(channel?.type).toBe('Track');
      if (channel?.type === 'Track') {
        expect(channel.playStatus).toBe('Playing');
        expect(channel.volume).toBe(1.0);
        expect(channel.fadeInMs).toBe(1000);
        expect(channel.fadeOutMs).toBe(2000);
        expect(channel.delayMs).toBe(100);
        expect(channel.offsetMs).toBe(200);
      }
      expect(updatedModel.isApplyingMixer).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('changes only specified channel when multiple channels exist', () => {
      // Arrange
      const model: NovelModel<string> = generateInitModel();
      model.mixer.channels = [
        {
          id: 'channel-1',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/bgm1.mp3',
        },
        {
          id: 'channel-2',
          type: 'Track',
          playStatus: 'Standby',
          volume: 0.8,
          src: 'audio/bgm2.mp3',
        },
        {
          id: 'channel-3',
          type: 'Track',
          playStatus: 'Stopped',
          volume: 0.6,
          src: 'audio/bgm3.mp3',
        },
      ];
      const message: PlayChannelMessage = {
        type: 'PlayChannel',
        channelId: 'channel-2',
        fadeInMs: 500,
      };
      const update = () => model;
      const applyMixer: ApplyMixer = async () => {};

      // Act
      const result = handlePlayChannel(model, message, update, applyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.channels).toHaveLength(3);
      const channel1 = updatedModel.mixer.channels[0];
      const channel2 = updatedModel.mixer.channels[1];
      const channel3 = updatedModel.mixer.channels[2];

      // channel-1 is unchanged
      expect(channel1?.id).toBe('channel-1');
      expect(channel1?.type).toBe('Track');
      if (channel1?.type === 'Track') {
        expect(channel1.playStatus).toBe('Standby');
        expect(channel1.volume).toBe(1.0);
      }

      // channel-2 is changed
      expect(channel2?.id).toBe('channel-2');
      expect(channel2?.type).toBe('Track');
      if (channel2?.type === 'Track') {
        expect(channel2.playStatus).toBe('Playing');
        expect(channel2.volume).toBe(0.8);
        expect(channel2.fadeInMs).toBe(500);
      }

      // channel-3 is unchanged
      expect(channel3?.id).toBe('channel-3');
      expect(channel3?.type).toBe('Track');
      if (channel3?.type === 'Track') {
        expect(channel3.playStatus).toBe('Stopped');
        expect(channel3.volume).toBe(0.6);
      }

      expect(updatedModel.isApplyingMixer).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });

    test('changes Track inside BusTrack to playing status', () => {
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
      const model: NovelModel<string> = generateInitModel();
      model.mixer.channels = [busTrack];
      const message: PlayChannelMessage = {
        type: 'PlayChannel',
        channelId: 'track-1',
        fadeInMs: 800,
        delayMs: 150,
      };
      const update = () => model;
      const applyMixer: ApplyMixer = async () => {};

      // Act
      const result = handlePlayChannel(model, message, update, applyMixer);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      const [updatedModel, cmd] = Array.isArray(result)
        ? result
        : [result, undefined];
      expect(updatedModel.mixer.channels).toHaveLength(1);
      const updatedBusTrack = updatedModel.mixer.channels[0];
      expect(updatedBusTrack).toBeDefined();
      if (updatedBusTrack && updatedBusTrack.type === 'BusTrack') {
        expect(updatedBusTrack.channels).toHaveLength(1);
        const track = updatedBusTrack.channels[0];
        expect(track?.id).toBe('track-1');
        expect(track?.type).toBe('Track');
        if (track?.type === 'Track') {
          expect(track.playStatus).toBe('Playing');
          expect(track.volume).toBe(0.7);
          expect(track.fadeInMs).toBe(800);
          expect(track.delayMs).toBe(150);
        }
      }
      expect(updatedModel.isApplyingMixer).toBe(true);
      expect(cmd).toBeDefined();
      expect(typeof cmd).toBe('function');
    });
  });

  describe('error cases', () => {
    test('handles error when channelId does not exist', () => {
      // Arrange
      const model: NovelModel<string> = generateInitModel();
      model.mixer.channels = [
        {
          id: 'channel-1',
          type: 'Track',
          playStatus: 'Standby',
          volume: 1.0,
          src: 'audio/bgm.mp3',
        },
      ];
      const message: PlayChannelMessage = {
        type: 'PlayChannel',
        channelId: 'non-existent-channel',
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
      handlePlayChannel(model, message, update, applyMixer);

      // Assert
      expect(errorMessage).toBeTruthy();
      expect(String(errorMessage)).toContain(
        'Channel with ID non-existent-channel does not exist in the mixer',
      );
    });
  });
});
