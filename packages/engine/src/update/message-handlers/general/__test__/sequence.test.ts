import { describe, expect, test } from 'bun:test';
import type { Cmd, Update } from 'elmish';
import { generateInitModel, type NovelModel } from '@/model';
import type { NovelMessage } from '@/update/message';
import { handleSequence, type SequenceMessage, sequence } from '../sequence';

describe('sequence', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange
      const messages: NovelMessage[] = [
        { type: 'ShowText', textBoxId: 'box1', content: 'Hello' },
        { type: 'Delay', durationMs: 100 },
      ];

      // Act
      const result = sequence(messages);

      // Assert
      expect(result).toEqual({
        type: 'Sequence',
        messages,
      });
    });
  });
});

describe('handleSequence', () => {
  describe('normal cases', () => {
    test('processes empty message array', async () => {
      // Arrange
      const model = generateInitModel();
      const msg: SequenceMessage<NovelMessage> = {
        type: 'Sequence',
        messages: [],
      };
      const mockUpdate: Update<NovelModel, NovelMessage> = (
        m,
        _msg,
      ) => m;

      // Act
      const result = handleSequence(model, msg, mockUpdate);

      // Assert
      expect(result).toBe(model);
    });

    test('processes all messages when no Delay is present', async () => {
      // Arrange
      const model = generateInitModel();
      let callCount = 0;

      const msg: SequenceMessage<NovelMessage> = {
        type: 'Sequence',
        messages: [
          {
            type: 'ShowText',
            textBoxId: 'box1',
            content: 'Hello',
          },
          {
            type: 'ShowImage',
            layoutId: 'layout1',
            src: 'test.png',
          },
        ],
      };

      const mockUpdate: Update<NovelModel, NovelMessage> = (
        m,
        _msg,
      ) => {
        callCount++;
        return m;
      };

      // Act
      const result = handleSequence(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(false);
      expect(callCount).toBe(2);
    });

    test('stops processing at Delay message and returns remaining messages', async () => {
      // Arrange
      const model = generateInitModel();
      const processedMessages: string[] = [];

      const msg: SequenceMessage<NovelMessage> = {
        type: 'Sequence',
        messages: [
          {
            type: 'ShowText',
            textBoxId: 'box1',
            content: 'Before delay',
          },
          { type: 'Delay', durationMs: 10 },
          {
            type: 'ShowText',
            textBoxId: 'box1',
            content: 'After delay',
          },
        ],
      };

      const mockUpdate: Update<NovelModel, NovelMessage> = (
        m,
        msg,
      ) => {
        processedMessages.push(msg.type);
        return m;
      };

      // Act
      const result = handleSequence(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (!Array.isArray(result)) return;

      const [_, cmd] = result;
      expect(processedMessages).toEqual(['ShowText', 'Delay']);

      if (!cmd) throw new Error('Expected cmd to be defined');
      const cmdResult = await cmd();
      expect(cmdResult.type).toBe('Sequence');
      if (cmdResult.type === 'Sequence') {
        expect(cmdResult.messages).toHaveLength(1);
        expect(cmdResult.messages[0]?.type).toBe('ShowText');
      }
    });

    test('stops at first Delay when multiple Delays are present', async () => {
      // Arrange
      const model = generateInitModel();
      const processedMessages: string[] = [];

      const msg: SequenceMessage<NovelMessage> = {
        type: 'Sequence',
        messages: [
          {
            type: 'ShowText',
            textBoxId: 'box1',
            content: 'First',
          },
          { type: 'Delay', durationMs: 10 },
          {
            type: 'ShowText',
            textBoxId: 'box1',
            content: 'Second',
          },
          { type: 'Delay', durationMs: 10 },
          {
            type: 'ShowText',
            textBoxId: 'box1',
            content: 'Third',
          },
        ],
      };

      const mockUpdate: Update<NovelModel, NovelMessage> = (
        m,
        msg,
      ) => {
        processedMessages.push(msg.type);
        return m;
      };

      // Act
      const result = handleSequence(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (!Array.isArray(result)) return;

      const [_, cmd] = result;
      expect(processedMessages).toEqual(['ShowText', 'Delay']);

      if (!cmd) throw new Error('Expected cmd to be defined');
      const cmdResult = await cmd();
      expect(cmdResult.type).toBe('Sequence');
      if (cmdResult.type === 'Sequence') {
        expect(cmdResult.messages).toHaveLength(3);
        expect(cmdResult.messages[0]?.type).toBe('ShowText');
        expect(cmdResult.messages[1]?.type).toBe('Delay');
        expect(cmdResult.messages[2]?.type).toBe('ShowText');
      }
    });

    test('correctly processes messages that return commands', async () => {
      // Arrange
      const model = generateInitModel();

      const msg: SequenceMessage<NovelMessage> = {
        type: 'Sequence',
        messages: [{ type: 'Delay', durationMs: 1 }],
      };

      const mockCmd: Cmd<NovelMessage> = async () => ({
        type: 'ShowText',
        textBoxId: 'box1',
        content: 'From command',
      });

      const mockUpdate: Update<NovelModel, NovelMessage> = (
        m,
        _msg,
      ) => {
        return [m, mockCmd];
      };

      // Act
      const result = handleSequence(model, msg, mockUpdate);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (!Array.isArray(result)) return;

      const [_, cmd] = result;
      if (!cmd) throw new Error('Expected cmd to be defined');
      const cmdResult = await cmd();

      expect(cmdResult.type).toBe('Sequence');
      if (cmdResult.type === 'Sequence') {
        expect(cmdResult.messages).toHaveLength(1);
        expect(cmdResult.messages[0]?.type).toBe('ShowText');
        if (cmdResult.messages[0]?.type === 'ShowText') {
          const showTextMsg = cmdResult.messages[0];
          expect(showTextMsg.content).toBe('From command');
        }
      }
    });
  });
});
