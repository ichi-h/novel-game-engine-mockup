import { describe, expect, test } from 'bun:test';
import {
  generateInitModel as _generateInitModel,
  type NovelModel,
} from '../../../model';
import type { NovelMessage } from '../../message';
import type { MiddlewareNext } from '../../update';
import { historyMiddleware } from '../history';

const generateInitModel = (): NovelModel<string> =>
  _generateInitModel<string>();

describe('historyMiddleware', () => {
  describe('normal cases', () => {
    test('adds message to history correctly', () => {
      // Arrange
      const initialModel = generateInitModel();
      const message: NovelMessage<string> = {
        type: 'Delay',
        durationMs: 1000,
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(initialModel, message, next);
      const [resultModel, resultCmd] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.Delay).toHaveLength(1);
      expect(resultModel.history.Delay[0]).toBe(message);
      expect(resultCmd).toBeUndefined();
    });

    test('preserves command when next returns [model, cmd]', () => {
      // Arrange
      const initialModel = generateInitModel();
      const message: NovelMessage<string> = {
        type: 'ShowText',
        textBoxId: 'textbox1',
        content: 'Hello',
      };
      const mockCmd = () =>
        Promise.resolve({ type: 'DelayCompleted' as const });
      const next: MiddlewareNext<string> = (model, _msg) => [model, mockCmd];

      // Act
      const result = historyMiddleware(initialModel, message, next);
      const [resultModel, resultCmd] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.ShowText).toHaveLength(1);
      expect(resultCmd).toBe(mockCmd);
    });

    test('sets command to undefined when next returns only model', () => {
      // Arrange
      const initialModel = generateInitModel();
      const message: NovelMessage<string> = {
        type: 'Error',
        value: new Error('Test error'),
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(initialModel, message, next);
      const [resultModel, resultCmd] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.Error).toHaveLength(1);
      expect(resultCmd).toBeUndefined();
    });

    test('trims history when exceeding historyLength', () => {
      // Arrange
      const existingMessages = [
        { type: 'AddLayout' as const, id: 'layout1' },
        { type: 'AddLayout' as const, id: 'layout2' },
        { type: 'AddLayout' as const, id: 'layout3' },
      ];
      const model = generateInitModel();
      const initialModel: NovelModel<string> = {
        ...model,
        history: {
          ...model.history,
          AddLayout: existingMessages,
        },
        config: {
          ...model.config,
          historyLength: {
            ...model.config.historyLength,
            AddLayout: 3,
          },
        },
      };
      const newMessage: NovelMessage<string> = {
        type: 'AddLayout',
        id: 'layout4',
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(initialModel, newMessage, next);
      const [resultModel, _] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.AddLayout).toHaveLength(3);
      expect(resultModel.history.AddLayout[0]).toBe(existingMessages[1]);
      expect(resultModel.history.AddLayout[1]).toBe(existingMessages[2]);
      expect(resultModel.history.AddLayout[2]).toBe(newMessage);
    });

    test('keeps all history when not exceeding historyLength', () => {
      // Arrange
      const existingMessages = [
        { type: 'ShowImage' as const, layoutId: 'layout1', src: 'image1.png' },
        { type: 'ShowImage' as const, layoutId: 'layout1', src: 'image2.png' },
      ];
      const initialModel = generateInitModel();
      const model: NovelModel<string> = {
        ...initialModel,
        history: {
          ...initialModel.history,
          ShowImage: existingMessages,
        },
        config: {
          ...initialModel.config,
          historyLength: {
            ...initialModel.config.historyLength,
            ShowImage: 5,
          },
        },
      };
      const newMessage: NovelMessage<string> = {
        type: 'ShowImage',
        layoutId: 'layout1',
        src: 'image3.png',
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(model, newMessage, next);
      const [resultModel, _] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.ShowImage).toHaveLength(3);
      expect(resultModel.history.ShowImage[0]).toBe(existingMessages[0]);
      expect(resultModel.history.ShowImage[1]).toBe(existingMessages[1]);
      expect(resultModel.history.ShowImage[2]).toBe(newMessage);
    });

    test('removes oldest message when history length equals historyLength', () => {
      // Arrange
      const existingMessages = [
        { type: 'PlayChannel' as const, channelId: 'ch1' },
        { type: 'PlayChannel' as const, channelId: 'ch2' },
      ];
      const initialModel = generateInitModel();
      const model: NovelModel<string> = {
        ...initialModel,
        history: {
          ...initialModel.history,
          PlayChannel: existingMessages,
        },
        config: {
          ...initialModel.config,
          historyLength: {
            ...initialModel.config.historyLength,
            PlayChannel: 2,
          },
        },
      };
      const newMessage: NovelMessage<string> = {
        type: 'PlayChannel',
        channelId: 'ch3',
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(model, newMessage, next);
      const [resultModel, _] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.PlayChannel).toHaveLength(2);
      expect(resultModel.history.PlayChannel[0]).toBe(existingMessages[1]);
      expect(resultModel.history.PlayChannel[1]).toBe(newMessage);
    });

    test('manages history independently for different message types', () => {
      // Arrange
      const delayMessage: NovelMessage<string> = {
        type: 'Delay',
        durationMs: 500,
      };
      const initialModel: NovelModel<string> = {
        ...generateInitModel(),
        history: {
          ...generateInitModel().history,
          AddLayout: [{ type: 'AddLayout' as const, id: 'existing' }],
        },
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(initialModel, delayMessage, next);
      const [resultModel, _] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.Delay).toHaveLength(1);
      expect(resultModel.history.Delay[0]).toBe(delayMessage);
      expect(resultModel.history.AddLayout).toHaveLength(1);
      expect(resultModel.history.AddLayout[0]).toEqual({
        type: 'AddLayout',
        id: 'existing',
      });
    });

    test('preserves existing history when adding new message', () => {
      // Arrange
      const existingMessage: NovelMessage<string> = {
        type: 'StopChannel',
        channelId: 'ch1',
      };
      const initialModel: NovelModel<string> = {
        ...generateInitModel(),
        history: {
          ...generateInitModel().history,
          StopChannel: [existingMessage],
        },
      };
      const newMessage: NovelMessage<string> = {
        type: 'StopChannel',
        channelId: 'ch2',
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(initialModel, newMessage, next);
      const [resultModel, _] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.StopChannel).toHaveLength(2);
      expect(resultModel.history.StopChannel[0]).toBe(existingMessage);
      expect(resultModel.history.StopChannel[1]).toBe(newMessage);
    });

    test('adds first message to empty history', () => {
      // Arrange
      const initialModel = generateInitModel();
      const message: NovelMessage<string> = {
        type: 'AddTextBox',
        id: 'textbox1',
        layoutId: 'layout1',
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(initialModel, message, next);
      const [resultModel, _] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.AddTextBox).toHaveLength(1);
      expect(resultModel.history.AddTextBox[0]).toBe(message);
    });

    test('does not retain history when historyLength is 0', () => {
      // Arrange
      const initialModel = generateInitModel();
      const model: NovelModel<string> = {
        ...initialModel,
        config: {
          ...initialModel.config,
          historyLength: {
            ...initialModel.config.historyLength,
            ChangeMasterVolume: 0,
          },
        },
      };
      const message: NovelMessage<string> = {
        type: 'ChangeMasterVolume',
        masterVolume: 0.5,
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(model, message, next);
      const [resultModel, _] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.ChangeMasterVolume).toHaveLength(0);
    });

    test('keeps only latest message when historyLength is 1', () => {
      // Arrange
      const existingMessage = {
        type: 'ChangeChannelVolume' as const,
        channelId: 'ch1',
        volume: 0.3,
      };
      const initialModel = generateInitModel();
      const model: NovelModel<string> = {
        ...initialModel,
        history: {
          ...initialModel.history,
          ChangeChannelVolume: [existingMessage],
        },
        config: {
          ...initialModel.config,
          historyLength: {
            ...initialModel.config.historyLength,
            ChangeChannelVolume: 1,
          },
        },
      };
      const newMessage: NovelMessage<string> = {
        type: 'ChangeChannelVolume',
        channelId: 'ch2',
        volume: 0.8,
      };
      const next: MiddlewareNext<string> = (model, _msg) => model;

      // Act
      const result = historyMiddleware(model, newMessage, next);
      const [resultModel, _] = Array.isArray(result)
        ? result
        : [result, undefined];

      // Assert
      expect(resultModel.history.ChangeChannelVolume).toHaveLength(1);
      expect(resultModel.history.ChangeChannelVolume[0]).toBe(newMessage);
      expect(resultModel.history.ChangeChannelVolume[0]).not.toBe(
        existingMessage,
      );
    });
  });
});
