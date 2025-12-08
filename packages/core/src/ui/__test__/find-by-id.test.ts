import { describe, expect, test } from 'bun:test';
import { findById } from '../find-by-id';
import { img, layout, type NovelWidget, text, textBox } from '../widgets';

describe('findById', () => {
  describe('normal cases', () => {
    test('finds widget at root level', () => {
      // Arrange
      const widgets: NovelWidget[] = [img({ id: 'root-img', src: 'test.png' })];

      // Act
      const result = findById(widgets, 'root-img');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('root-img');
    });

    test('finds widget in nested Layout', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        layout({ id: 'parent' })([img({ id: 'child-img', src: 'test.png' })]),
      ];

      // Act
      const result = findById(widgets, 'child-img');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('child-img');
    });

    test('finds widget in deeply nested structure', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        layout({ id: 'level1' })([
          layout({ id: 'level2' })([img({ id: 'level3', src: 'test.png' })]),
        ]),
      ];

      // Act
      const result = findById(widgets, 'level3');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('level3');
    });

    test('finds text in TextBox children', () => {
      // Arrange
      const textBoxWidget = textBox({ id: 'textbox1' })([
        text({ id: 'text1', content: 'Hello' }),
      ]);
      const widgets: NovelWidget[] = [textBoxWidget];

      // Act
      const result = findById(widgets, 'text1');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('text1');
    });

    test('returns null for non-existent ID', () => {
      // Arrange
      const widgets: NovelWidget[] = [img({ id: 'img1', src: 'test.png' })];

      // Act
      const result = findById(widgets, 'non-existent');

      // Assert
      expect(result).toBeNull();
    });

    test('returns null for empty widget array', () => {
      // Arrange
      const widgets: NovelWidget[] = [];

      // Act
      const result = findById(widgets, 'any-id');

      // Assert
      expect(result).toBeNull();
    });

    test('finds Layout widget itself', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        layout({ id: 'parent' })([img({ id: 'child', src: 'test.png' })]),
      ];

      // Act
      const result = findById(widgets, 'parent');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('parent');
      expect(result?.type).toBe('Layout');
    });

    test('finds TextBox widget itself', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        textBox({ id: 'textbox1' })([text({ content: 'Hello' })]),
      ];

      // Act
      const result = findById(widgets, 'textbox1');

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe('textbox1');
      expect(result?.type).toBe('TextBox');
    });
  });
});
