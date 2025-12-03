import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import {
  type DelayCompletedMessage,
  type DelayMessage,
  delay,
  handleDelay,
  handleDelayCompleted,
} from '../delay';

describe('delay', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange & Act
      const result = delay(1000);

      // Assert
      expect(result).toEqual({
        type: 'Delay',
        durationMs: 1000,
      });
    });
  });
});

describe('handleDelay / handleDelayCompleted - normal cases', () => {
  test('handleDelay sets isDelaying true and returns a command', () => {
    const model = generateInitModel();

    const msg: DelayMessage = {
      type: 'Delay',
      durationMs: 10,
    };

    const res = handleDelay(model, msg);

    // should be the tuple form [model, cmd]
    expect(Array.isArray(res)).toBe(true);
    if (!Array.isArray(res)) return; // type guard for TS

    const nextModel = res[0];
    const cmd = res[1];

    // model status is set to Delaying
    expect(nextModel.status.value).toBe('Delaying');
    // returns a new model object
    expect(nextModel).not.toBe(model);
    // command is a function
    expect(typeof cmd).toBe('function');
  });

  test('returned command resolves to DelayCompleted message and can be handled', async () => {
    const model = generateInitModel();

    const msg: DelayMessage = {
      type: 'Delay',
      durationMs: 5,
    };

    const res = handleDelay(model, msg);
    expect(Array.isArray(res)).toBe(true);
    if (!Array.isArray(res)) throw new Error('expected tuple from handleDelay');

    const cmd = res[1] as () => Promise<DelayCompletedMessage>;
    const result = await cmd();

    expect(result).toEqual({ type: 'DelayCompleted' });

    // simulate dispatching the message to the completed handler
    const completedMsg: DelayCompletedMessage = result;
    const after = handleDelayCompleted(model, completedMsg);
    expect(after.status.value).toBe('Processed');
    // handler returns a new model object
    expect(after).not.toBe(model);
  });
});
