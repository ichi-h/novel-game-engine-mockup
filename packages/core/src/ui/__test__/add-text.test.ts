import { describe, expect, test } from 'bun:test';
import { addTextWidget } from '../add-text';
import { hasId } from '../has-id';
import {
  layout,
  type NovelWidget,
  type TextBoxWidget,
  text,
  textBox,
} from '../widgets';

describe('addTextWidget', () => {
  describe('normal cases', () => {
    test('adds text to TextBox with only required fields', () => {
      // Arrange
      let widgets: NovelWidget[] = [textBox({ id: 'textbox1' })([])];
      const textWidget = text({ content: 'Hello, World!' });

      // Act
      widgets = addTextWidget(widgets, textWidget, 'textbox1');

      // Assert
      expect(hasId(widgets, 'textbox1')).toBe(true);
      const box = widgets[0] as TextBoxWidget;
      expect(box.children).toHaveLength(1);
      expect(box.children[0]?.content).toBe('Hello, World!');
    });

    test('adds text to TextBox with ID and optional fields', () => {
      // Arrange
      let widgets: NovelWidget[] = [textBox({ id: 'textbox1' })([])];
      const textWidget = text({
        id: 'text1',
        content: 'Styled text',
        className: 'font-weight: bold;',
        speed: 50,
      });

      // Act
      widgets = addTextWidget(widgets, textWidget, 'textbox1');

      // Assert
      expect(hasId(widgets, 'textbox1')).toBe(true);
      expect(hasId(widgets, 'text1')).toBe(true);
    });

    test('adds multiple texts to same TextBox', () => {
      // Arrange
      let widgets: NovelWidget[] = [textBox({ id: 'textbox1' })([])];
      const text1 = text({ id: 'text1', content: 'First text' });
      const text2 = text({ id: 'text2', content: 'Second text' });

      // Act
      widgets = addTextWidget(widgets, text1, 'textbox1');
      widgets = addTextWidget(widgets, text2, 'textbox1');

      // Assert
      expect(hasId(widgets, 'text1')).toBe(true);
      expect(hasId(widgets, 'text2')).toBe(true);
      expect(hasId(widgets, 'textbox1')).toBe(true);
    });

    test('adds text to TextBox nested in Layout', () => {
      // Arrange
      let widgets: NovelWidget[] = [
        layout({ id: 'parent' })([textBox({ id: 'textbox1' })([])]),
      ];
      const textWidget = text({ id: 'text1', content: 'Nested text' });

      // Act
      widgets = addTextWidget(widgets, textWidget, 'textbox1');

      // Assert
      expect(hasId(widgets, 'text1')).toBe(true);
      expect(hasId(widgets, 'textbox1')).toBe(true);
    });
  });

  describe('error cases', () => {
    test('throws error when adding text with duplicate ID', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        textBox({ id: 'textbox1' })([
          text({ id: 'duplicate', content: 'First text' }),
        ]),
      ];
      const text2 = text({ id: 'duplicate', content: 'Second text' });

      // Act & Assert
      expect(() => addTextWidget(widgets, text2, 'textbox1')).toThrow(
        'Widget with id "duplicate" already exists',
      );
    });

    test('throws error when textBoxId does not exist', () => {
      // Arrange
      const widgets: NovelWidget[] = [];
      const textWidget = text({ content: 'Hello' });

      // Act & Assert
      expect(() => addTextWidget(widgets, textWidget, 'non-existent')).toThrow(
        'TextBox with id "non-existent" not found',
      );
    });

    test('throws error when textBoxId points to non-TextBox widget', () => {
      // Arrange
      const widgets: NovelWidget[] = [layout({ id: 'layout1' })([])];
      const textWidget = text({ content: 'Hello' });

      // Act & Assert
      expect(() => addTextWidget(widgets, textWidget, 'layout1')).toThrow(
        'TextBox with id "layout1" not found',
      );
    });

    test('throws error when text ID conflicts with existing widget ID', () => {
      // Arrange
      const widgets: NovelWidget[] = [
        layout({ id: 'existing-widget' })([textBox({ id: 'textbox1' })([])]),
      ];
      const textWidget = text({ id: 'existing-widget', content: 'Text' });

      // Act & Assert
      expect(() => addTextWidget(widgets, textWidget, 'textbox1')).toThrow(
        'Widget with id "existing-widget" already exists',
      );
    });
  });
});
