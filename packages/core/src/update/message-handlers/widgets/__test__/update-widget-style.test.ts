import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { addWidget, findById, w } from '@/ui';
import {
  handleUpdateWidgetStyle,
  type UpdateWidgetStyleMessage,
  updateWidgetStyle,
} from '../update-widget-style';

describe('updateWidgetStyle', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange & Act
      const result = updateWidgetStyle({
        widgetId: 'widget1',
        className: 'bg-blue-500',
      });

      // Assert
      expect(result).toEqual({
        type: 'UpdateWidgetStyle',
        widgetId: 'widget1',
        className: 'bg-blue-500',
      });
    });
  });
});

describe('handleUpdateWidgetStyle - normal cases', () => {
  test('updates style of root-level widget', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(
      model.ui,
      w.layout({ id: 'layout1', className: 'old-class' })([]),
    );

    const msg: UpdateWidgetStyleMessage = {
      type: 'UpdateWidgetStyle',
      widgetId: 'layout1',
      className: 'new-class',
    };

    // Act
    const result = handleUpdateWidgetStyle(model, msg);

    // Assert
    const updatedWidget = findById(result.ui, 'layout1');
    expect(updatedWidget).not.toBeNull();
    expect(updatedWidget?.className).toBe('new-class');
  });

  test('updates style of nested widget in layout', () => {
    // Arrange
    const model = generateInitModel();
    const childImage = w.img({
      id: 'img1',
      src: 'test.png',
      className: 'old-style',
    });
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([childImage]));

    const msg: UpdateWidgetStyleMessage = {
      type: 'UpdateWidgetStyle',
      widgetId: 'img1',
      className: 'new-style',
    };

    // Act
    const result = handleUpdateWidgetStyle(model, msg);

    // Assert
    const updatedWidget = findById(result.ui, 'img1');
    expect(updatedWidget).not.toBeNull();
    expect(updatedWidget?.className).toBe('new-style');
  });

  test('updates style of text in text box', () => {
    // Arrange
    const model = generateInitModel();
    const textWidget = w.text({
      id: 'text1',
      content: 'Hello',
      className: 'old-text-style',
    });
    model.ui = addWidget(
      model.ui,
      w.layout({ id: 'parent' })([w.textBox({ id: 'textBox1' })([textWidget])]),
    );

    const msg: UpdateWidgetStyleMessage = {
      type: 'UpdateWidgetStyle',
      widgetId: 'text1',
      className: 'new-text-style',
    };

    // Act
    const result = handleUpdateWidgetStyle(model, msg);

    // Assert
    const updatedTextBox = findById(result.ui, 'textBox1');
    expect(updatedTextBox).not.toBeNull();
    if (updatedTextBox?.type === 'TextBox') {
      const updatedText = updatedTextBox.children.find((t) => t.id === 'text1');
      expect(updatedText).toBeDefined();
      expect(updatedText?.className).toBe('new-text-style');
    }
  });

  test('replaces className completely (not merge)', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(
      model.ui,
      w.layout({ id: 'layout1', className: 'bg-red-500 p-4 m-2' })([]),
    );

    const msg: UpdateWidgetStyleMessage = {
      type: 'UpdateWidgetStyle',
      widgetId: 'layout1',
      className: 'bg-blue-500',
    };

    // Act
    const result = handleUpdateWidgetStyle(model, msg);

    // Assert
    const updatedWidget = findById(result.ui, 'layout1');
    expect(updatedWidget?.className).toBe('bg-blue-500');
    expect(updatedWidget?.className).not.toContain('p-4');
    expect(updatedWidget?.className).not.toContain('m-2');
  });

  test('can set empty className', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(
      model.ui,
      w.layout({ id: 'layout1', className: 'some-class' })([]),
    );

    const msg: UpdateWidgetStyleMessage = {
      type: 'UpdateWidgetStyle',
      widgetId: 'layout1',
      className: '',
    };

    // Act
    const result = handleUpdateWidgetStyle(model, msg);

    // Assert
    const updatedWidget = findById(result.ui, 'layout1');
    expect(updatedWidget?.className).toBe('');
  });

  test('updates style of deeply nested widget', () => {
    // Arrange
    const model = generateInitModel();
    const deepImage = w.img({
      id: 'deep-img',
      src: 'deep.png',
      className: 'old-deep',
    });
    model.ui = addWidget(
      model.ui,
      w.layout({ id: 'root' })([
        w.layout({ id: 'level1' })([w.layout({ id: 'level2' })([deepImage])]),
      ]),
    );

    const msg: UpdateWidgetStyleMessage = {
      type: 'UpdateWidgetStyle',
      widgetId: 'deep-img',
      className: 'new-deep',
    };

    // Act
    const result = handleUpdateWidgetStyle(model, msg);

    // Assert
    const updatedWidget = findById(result.ui, 'deep-img');
    expect(updatedWidget).not.toBeNull();
    expect(updatedWidget?.className).toBe('new-deep');
  });
});

describe('handleUpdateWidgetStyle - error cases', () => {
  test('throws error for non-existent widget ID', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'existing' })([]));

    const msg: UpdateWidgetStyleMessage = {
      type: 'UpdateWidgetStyle',
      widgetId: 'non-existent',
      className: 'new-style',
    };

    // Act & Assert
    expect(() => handleUpdateWidgetStyle(model, msg)).toThrow(
      'Widget with id "non-existent" not found',
    );
  });

  test('does not modify model when error occurs', () => {
    // Arrange
    const model = generateInitModel();
    const originalWidget = w.layout({
      id: 'widget1',
      className: 'original-class',
    })([]);
    model.ui = addWidget(model.ui, originalWidget);

    const msg: UpdateWidgetStyleMessage = {
      type: 'UpdateWidgetStyle',
      widgetId: 'non-existent',
      className: 'new-class',
    };

    // Act & Assert
    expect(() => handleUpdateWidgetStyle(model, msg)).toThrow();

    // Verify original widget is unchanged
    const unchangedWidget = findById(model.ui, 'widget1');
    expect(unchangedWidget?.className).toBe('original-class');
  });
});
