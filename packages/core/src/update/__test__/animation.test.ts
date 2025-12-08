import { describe, expect, test } from 'bun:test';
import { calcTextAnimationDuration } from '../animation';

describe('calcTextAnimationDuration', () => {
  describe('normal cases', () => {
    test('returns 0 when speed is 100 or greater', () => {
      // Arrange & Act
      const result1 = calcTextAnimationDuration(100, 10);
      const result2 = calcTextAnimationDuration(150, 10);

      // Assert
      expect(result1).toBe(0);
      expect(result2).toBe(0);
    });

    test('returns minimum display time when speed is 0 or less', () => {
      // Arrange
      const charPosition = 10;
      const minDisplayTimePerChar = 200;

      // Act
      const result1 = calcTextAnimationDuration(0, charPosition);
      const result2 = calcTextAnimationDuration(-10, charPosition);

      // Assert
      expect(result1).toBe(minDisplayTimePerChar * charPosition);
      expect(result2).toBe(minDisplayTimePerChar * charPosition);
    });

    test('calculates intermediate value when speed is between 0 and 100', () => {
      // Arrange
      const charPosition = 10;
      const speed = 50;
      const maxDisplayTimePerChar = 100;
      const expected =
        maxDisplayTimePerChar * ((100 - speed) / 100) * charPosition;

      // Act
      const result = calcTextAnimationDuration(speed, charPosition);

      // Assert
      expect(result).toBe(expected);
    });

    test('calculates correctly for different character positions', () => {
      // Arrange
      const speed = 50;
      const charPosition1 = 5;
      const charPosition2 = 20;
      const maxDisplayTimePerChar = 100;

      // Act
      const result1 = calcTextAnimationDuration(speed, charPosition1);
      const result2 = calcTextAnimationDuration(speed, charPosition2);

      // Assert
      expect(result1).toBe(maxDisplayTimePerChar * 0.5 * charPosition1);
      expect(result2).toBe(maxDisplayTimePerChar * 0.5 * charPosition2);
    });
  });
});
