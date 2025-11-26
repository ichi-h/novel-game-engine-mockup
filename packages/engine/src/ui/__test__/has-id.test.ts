import { describe, expect, test } from 'bun:test';
import { hasId } from '../has-id';
import {
  customLayout,
  img,
  layout,
  type NovelWidget,
  text,
  textBox,
} from '../widgets';

describe('hasId', () => {
  describe('normal cases', () => {
    test('finds ID at root level', () => {
      // Arrange
      const widgets: NovelWidget[] = [img({ id: 'root-img', src: 'test.png' })];

      // Act & Assert
      expect(hasId(widgets, 'root-img')).toBe(true);
    });

    test('finds ID in nested Layout', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        layout({ id: 'parent' })([img({ id: 'child-img', src: 'test.png' })]),
      ];

      // Act & Assert
      expect(hasId(widgets, 'child-img')).toBe(true);
    });

    test('finds ID in deeply nested structure', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        layout({ id: 'level1' })([
          layout({ id: 'level2' })([img({ id: 'level3', src: 'test.png' })]),
        ]),
      ];

      // Act & Assert
      expect(hasId(widgets, 'level3')).toBe(true);
    });

    test('finds ID in TextBox children', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        textBox({ id: 'textbox1' })([text({ id: 'text1', content: 'Hello' })]),
      ];

      // Act & Assert
      expect(hasId(widgets, 'text1')).toBe(true);
    });

    test('returns false for non-existent ID', () => {
      // Arrange
      const widgets: NovelWidget[] = [img({ id: 'img1', src: 'test.png' })];

      // Act & Assert
      expect(hasId(widgets, 'non-existent')).toBe(false);
    });

    test('returns false when searching in widgets without IDs', () => {
      // Arrange
      const widgets: NovelWidget[] = [img({ src: 'test.png' })]; // No ID

      // Act & Assert
      expect(hasId(widgets, 'any-id')).toBe(false);
    });

    test('finds ID in CustomLayout children', () => {
      // Arrange
      const widgets: NovelWidget<string>[] = [
        customLayout<string>({
          id: 'custom',
          component: 'TestComponent',
        })([img({ id: 'child', src: 'test.png' })]),
      ];

      // Act & Assert
      expect(hasId(widgets, 'child')).toBe(true);
    });

    test('returns false for empty widget array', () => {
      // Arrange
      const widgets: NovelWidget[] = [];

      // Act & Assert
      expect(hasId(widgets, 'any-id')).toBe(false);
    });
  });
});
