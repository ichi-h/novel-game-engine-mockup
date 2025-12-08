import { describe, expect, test } from 'bun:test';
import { hasId } from '../has-id';
import { removeById } from '../remove-by-id';
import { img, layout, type NovelWidget, text, textBox } from '../widgets';

describe('removeById', () => {
  describe('normal cases', () => {
    test('removes widget at root level', () => {
      // Arrange
      let widgets: NovelWidget[] = [img({ id: 'img1', src: 'test.png' })];

      // Act
      widgets = removeById(widgets, 'img1');

      // Assert
      expect(hasId(widgets, 'img1')).toBe(false);
      expect(widgets).toHaveLength(0);
    });

    test('removes nested widget in Layout', () => {
      // Arrange
      let widgets: NovelWidget[] = [
        layout({ id: 'parent' })([img({ id: 'child', src: 'test.png' })]),
      ];

      // Act
      widgets = removeById(widgets, 'child');

      // Assert
      expect(hasId(widgets, 'parent')).toBe(true);
      expect(hasId(widgets, 'child')).toBe(false);
    });

    test('removes deeply nested widget', () => {
      // Arrange
      let widgets: NovelWidget[] = [
        layout({ id: 'level1' })([
          layout({ id: 'level2' })([img({ id: 'level3', src: 'test.png' })]),
        ]),
      ];

      // Act
      widgets = removeById(widgets, 'level3');

      // Assert
      expect(hasId(widgets, 'level1')).toBe(true);
      expect(hasId(widgets, 'level2')).toBe(true);
      expect(hasId(widgets, 'level3')).toBe(false);
    });

    test('removes text from TextBox', () => {
      // Arrange
      let widgets: NovelWidget[] = [
        textBox({ id: 'textbox1' })([text({ id: 'text1', content: 'Hello' })]),
      ];

      // Act
      widgets = removeById(widgets, 'text1');

      // Assert
      expect(hasId(widgets, 'textbox1')).toBe(true);
      expect(hasId(widgets, 'text1')).toBe(false);
    });

    test('removes one widget among multiple widgets', () => {
      // Arrange
      let widgets: NovelWidget[] = [
        img({ id: 'img1', src: 'test1.png' }),
        img({ id: 'img2', src: 'test2.png' }),
        img({ id: 'img3', src: 'test3.png' }),
      ];

      // Act
      widgets = removeById(widgets, 'img2');

      // Assert
      expect(hasId(widgets, 'img1')).toBe(true);
      expect(hasId(widgets, 'img2')).toBe(false);
      expect(hasId(widgets, 'img3')).toBe(true);
      expect(widgets).toHaveLength(2);
    });

    test('removes parent Layout with all its children', () => {
      // Arrange
      let widgets: NovelWidget[] = [
        layout({ id: 'parent' })([
          img({ id: 'child1', src: 'test1.png' }),
          img({ id: 'child2', src: 'test2.png' }),
        ]),
      ];

      // Act
      widgets = removeById(widgets, 'parent');

      // Assert
      expect(hasId(widgets, 'parent')).toBe(false);
      expect(hasId(widgets, 'child1')).toBe(false);
      expect(hasId(widgets, 'child2')).toBe(false);
      expect(widgets).toHaveLength(0);
    });
  });

  describe('error cases', () => {
    test('throws error when ID does not exist', () => {
      // Arrange
      const widgets: NovelWidget[] = [];

      // Act & Assert
      expect(() => removeById(widgets, 'non-existent')).toThrow(
        'Widget with id "non-existent" not found',
      );
    });

    test('throws error when trying to remove already removed widget', () => {
      // Arrange
      let widgets: NovelWidget[] = [img({ id: 'img1', src: 'test.png' })];
      widgets = removeById(widgets, 'img1');

      // Act & Assert
      expect(() => removeById(widgets, 'img1')).toThrow(
        'Widget with id "img1" not found',
      );
    });
  });
});
