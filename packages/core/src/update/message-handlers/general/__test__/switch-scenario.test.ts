import { describe, expect, test } from 'bun:test';
import { generateInitModel, type NovelModel } from '@/model';
import {
  handleSwitchScenario,
  type SwitchScenarioMessage,
} from '../switch-scenario';

describe('handleSwitchScenario', () => {
  describe('normal cases', () => {
    test('switches to a new scenario with default index 0', () => {
      // Arrange
      const model = generateInitModel();
      const msg: SwitchScenarioMessage = {
        type: 'SwitchScenario',
        scenario: 'chapter2',
      };

      // Act
      const result = handleSwitchScenario(model, msg);

      // Assert
      expect(result.currentScenario).toBe('chapter2');
      expect(result.index).toBe(0);
    });

    test('switches to a new scenario with specified index', () => {
      // Arrange
      const model = generateInitModel();
      const msg: SwitchScenarioMessage = {
        type: 'SwitchScenario',
        scenario: 'flashback',
        index: 5,
      };

      // Act
      const result = handleSwitchScenario(model, msg);

      // Assert
      expect(result.currentScenario).toBe('flashback');
      expect(result.index).toBe(5);
    });

    test('preserves state when resetState is false', () => {
      // Arrange
      const model = generateInitModel();
      const modelWithState: NovelModel = {
        ...model,
        status: { value: 'Delaying', remainingTime: 1000 },
        mixer: {
          value: {
            volume: 0.8,
            channels: [
              {
                id: 'bgm1',
                type: 'Track',
                src: 'test.mp3',
                volume: 0.5,
                playStatus: 'Playing',
              },
            ],
          },
          isApplying: false,
        },
        ui: [{ type: 'Layout', id: 'test-layout', children: [] }],
        animationTickets: [
          { id: 'test-ticket', ttl: 1000, nextMessageCaught: 'ignore' },
        ],
      };
      const msg: SwitchScenarioMessage = {
        type: 'SwitchScenario',
        scenario: 'chapter2',
        resetState: false,
      };

      // Act
      const result = handleSwitchScenario(modelWithState, msg);

      // Assert
      expect(result.currentScenario).toBe('chapter2');
      expect(result.index).toBe(0);
      expect(result.status).toEqual({ value: 'RequestingNext' });
      expect(result.mixer.value.channels).toHaveLength(1);
      expect(result.ui).toHaveLength(1);
      expect(result.animationTickets).toHaveLength(1);
    });

    test('resets state when resetState is true', () => {
      // Arrange
      const model = generateInitModel();
      const modelWithState: NovelModel = {
        ...model,
        status: { value: 'Delaying', remainingTime: 1000 },
        mixer: {
          value: {
            volume: 0.8,
            channels: [
              {
                id: 'bgm1',
                type: 'Track',
                src: 'test.mp3',
                volume: 0.5,
                playStatus: 'Playing',
              },
            ],
          },
          isApplying: false,
        },
        ui: [{ type: 'Layout', id: 'test-layout', children: [] }],
        animationTickets: [
          { id: 'test-ticket', ttl: 1000, nextMessageCaught: 'ignore' },
        ],
      };
      const msg: SwitchScenarioMessage = {
        type: 'SwitchScenario',
        scenario: 'ending_good',
        resetState: true,
      };

      // Act
      const result = handleSwitchScenario(modelWithState, msg);

      // Assert
      expect(result.currentScenario).toBe('ending_good');
      expect(result.index).toBe(0);
      expect(result.status).toEqual({ value: 'RequestingNext' });
      expect(result.mixer.value.channels).toHaveLength(0);
      expect(result.mixer.isApplying).toBe(false);
      expect(result.ui).toHaveLength(0);
      expect(result.animationTickets).toHaveLength(0);
    });

    test('resets state with custom index', () => {
      // Arrange
      const model = generateInitModel();
      const modelWithState: NovelModel = {
        ...model,
        mixer: {
          value: {
            volume: 0.8,
            channels: [
              {
                id: 'bgm1',
                type: 'Track',
                src: 'test.mp3',
                volume: 0.5,
                playStatus: 'Playing',
              },
            ],
          },
          isApplying: false,
        },
        ui: [{ type: 'Layout', id: 'test-layout', children: [] }],
      };
      const msg: SwitchScenarioMessage = {
        type: 'SwitchScenario',
        scenario: 'chapter3',
        index: 10,
        resetState: true,
      };

      // Act
      const result = handleSwitchScenario(modelWithState, msg);

      // Assert
      expect(result.currentScenario).toBe('chapter3');
      expect(result.index).toBe(10);
      expect(result.status).toEqual({ value: 'RequestingNext' });
      expect(result.mixer.value.channels).toHaveLength(0);
      expect(result.ui).toHaveLength(0);
    });
  });
});
