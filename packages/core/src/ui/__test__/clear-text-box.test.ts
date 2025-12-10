import { describe, expect, test } from 'bun:test';
import { clearTextBoxWidget } from '../clear-text-box';
import { hasId } from '../has-id';
import { layout, type NovelWidget, text, textBox } from '../widgets';

describe('clearTextBoxWidget', () => {
  describe('normal cases', () => {
    test('clears TextBox with texts', () => {
      // Arrange
      let widgets: NovelWidget[] = [
        textBox({ id: 'textbox1' })([
          text({ id: 'text1', content: 'First' }),
          text({ id: 'text2', content: 'Second' }),
        ]),
      ];

      // Act
      widgets = clearTextBoxWidget(widgets, 'textbox1');

      // Assert
      expect(hasId(widgets, 'textbox1')).toBe(true);
      expect(hasId(widgets, 'text1')).toBe(false);
      expect(hasId(widgets, 'text2')).toBe(false);
    });

    test('clears empty TextBox without error', () => {
      // Arrange
      let widgets: NovelWidget[] = [textBox({ id: 'textbox1' })([])];

      // Act & Assert
      expect(() => clearTextBoxWidget(widgets, 'textbox1')).not.toThrow();
      widgets = clearTextBoxWidget(widgets, 'textbox1');
      expect(hasId(widgets, 'textbox1')).toBe(true);
    });

    test('clears TextBox nested in Layout', () => {
      // Arrange
      let widgets: NovelWidget[] = [
        layout({ id: 'parent' })([
          textBox({ id: 'textbox1' })([
            text({ id: 'text1', content: 'Hello' }),
          ]),
        ]),
      ];

      // Act
      widgets = clearTextBoxWidget(widgets, 'textbox1');

      // Assert
      expect(hasId(widgets, 'textbox1')).toBe(true);
      expect(hasId(widgets, 'text1')).toBe(false);
    });
  });

  describe('error cases', () => {
    test('throws error when textBoxId does not exist', () => {
      // Arrange
      const widgets: NovelWidget[] = [];

      // Act & Assert
      expect(() => clearTextBoxWidget(widgets, 'non-existent')).toThrow(
        'TextBox with id "non-existent" not found',
      );
    });

    test('throws error when ID points to non-TextBox widget', () => {
      // Arrange
      const widgets: NovelWidget[] = [layout({ id: 'layout1' })([])];

      // Act & Assert
      expect(() => clearTextBoxWidget(widgets, 'layout1')).toThrow(
        'TextBox with id "layout1" not found',
      );
    });
  });
});
