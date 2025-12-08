import { describe, expect, test } from 'bun:test';
import { WidgetManager } from '../manager';
import {
  img,
  layout,
  type NovelWidget,
  type TextBoxWidget,
  text,
  textBox,
} from '../widgets';

describe('WidgetManager', () => {
  describe('constructor', () => {
    describe('normal cases', () => {
      test('initializes with empty array when no argument is provided', () => {
        // Arrange & Act
        const manager = new WidgetManager();

        // Assert
        expect(manager.widgets).toHaveLength(0);
      });

      test('initializes with empty array when empty array is provided', () => {
        // Arrange & Act
        const manager = new WidgetManager([]);

        // Assert
        expect(manager.widgets).toHaveLength(0);
      });

      test('initializes with provided widgets', () => {
        // Arrange
        const initialWidgets: NovelWidget[] = [
          layout({ id: 'layout1' })([]),
          img({ id: 'img1', src: 'test.png' }),
        ];

        // Act
        const manager = new WidgetManager(initialWidgets);

        // Assert
        expect(manager.widgets).toHaveLength(2);
        expect(manager.hasId('layout1')).toBe(true);
        expect(manager.hasId('img1')).toBe(true);
      });
    });
  });

  describe('widgets getter', () => {
    describe('normal cases', () => {
      test('returns empty array for empty widget list', () => {
        // Arrange
        const manager = new WidgetManager();

        // Act
        const widgets = manager.widgets;

        // Assert
        expect(widgets).toHaveLength(0);
        expect(Array.isArray(widgets)).toBe(true);
      });

      test('returns widget list correctly', () => {
        // Arrange
        const manager = new WidgetManager();
        const layoutWidget = layout({ id: 'layout1' })([]);
        manager.addWidget(layoutWidget);

        // Act
        const widgets = manager.widgets;

        // Assert
        expect(widgets).toHaveLength(1);
        expect(widgets[0]).toBe(layoutWidget);
      });

      test('returns frozen array (immutable)', () => {
        // Arrange
        const manager = new WidgetManager();
        manager.addWidget(layout({ id: 'layout1' })([]));

        // Act
        const widgets = manager.widgets;

        // Assert
        expect(Object.isFrozen(widgets)).toBe(true);
        expect(() => {
          // @ts-expect-error: Testing runtime immutability
          widgets.push(img({ src: 'test.png' }));
        }).toThrow();
      });
    });
  });

  describe('addWidget', () => {
    describe('normal cases', () => {
      test('adds widget to root', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget = img({ id: 'img1', src: 'test.png' });

        // Act
        manager.addWidget(widget);

        // Assert
        expect(manager.widgets).toHaveLength(1);
        expect(manager.hasId('img1')).toBe(true);
      });

      test('adds widget to Layout as child', () => {
        // Arrange
        const manager = new WidgetManager();
        const parentLayout = layout({ id: 'parent' })([]);
        manager.addWidget(parentLayout);
        const childWidget = img({ id: 'child', src: 'test.png' });

        // Act
        manager.addWidget(childWidget, 'parent');

        // Assert
        expect(manager.hasId('parent')).toBe(true);
        expect(manager.hasId('child')).toBe(true);
      });

      test('adds widget to nested Layout', () => {
        // Arrange
        const manager = new WidgetManager();
        const rootLayout = layout({ id: 'root' })([]);
        manager.addWidget(rootLayout);
        const nestedLayout = layout({ id: 'nested' })([]);
        manager.addWidget(nestedLayout, 'root');
        const deepWidget = img({ id: 'deep', src: 'test.png' });

        // Act
        manager.addWidget(deepWidget, 'nested');

        // Assert
        expect(manager.hasId('root')).toBe(true);
        expect(manager.hasId('nested')).toBe(true);
        expect(manager.hasId('deep')).toBe(true);
      });

      test('adds multiple widgets to root', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget1 = img({ id: 'img1', src: 'test1.png' });
        const widget2 = img({ id: 'img2', src: 'test2.png' });

        // Act
        manager.addWidget(widget1);
        manager.addWidget(widget2);

        // Assert
        expect(manager.widgets).toHaveLength(2);
        expect(manager.hasId('img1')).toBe(true);
        expect(manager.hasId('img2')).toBe(true);
      });
    });

    describe('error cases', () => {
      test('throws error when adding widget with duplicate ID', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget1 = img({ id: 'duplicate', src: 'test1.png' });
        manager.addWidget(widget1);
        const widget2 = img({ id: 'duplicate', src: 'test2.png' });

        // Act & Assert
        expect(() => manager.addWidget(widget2)).toThrow(
          'Widget with id "duplicate" already exists',
        );
      });

      test('throws error when adding widget with ID that exists in nested structure', () => {
        // Arrange
        const manager = new WidgetManager();
        const parentLayout = layout({ id: 'parent' })([]);
        manager.addWidget(parentLayout);
        const childWidget = img({ id: 'child', src: 'test.png' });
        manager.addWidget(childWidget, 'parent');

        const duplicateWidget = layout({ id: 'child' })([]);

        // Act & Assert
        expect(() => manager.addWidget(duplicateWidget)).toThrow(
          'Widget with id "child" already exists',
        );
      });

      test('throws error when layoutId does not exist', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget = img({ id: 'img1', src: 'test.png' });

        // Act & Assert
        expect(() => manager.addWidget(widget, 'non-existent')).toThrow(
          'Layout with id "non-existent" not found',
        );
      });

      test('throws error when layoutId points to non-Layout widget', () => {
        // Arrange
        const manager = new WidgetManager();
        const imageWidget = img({ id: 'img1', src: 'test.png' });
        manager.addWidget(imageWidget);
        const newWidget = img({ id: 'img2', src: 'test2.png' });

        // Act & Assert
        expect(() => manager.addWidget(newWidget, 'img1')).toThrow(
          'Layout with id "img1" not found',
        );
      });

      test('throws error when layoutId points to TextBox widget', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const newWidget = img({ id: 'img1', src: 'test.png' });

        // Act & Assert
        expect(() => manager.addWidget(newWidget, 'textbox1')).toThrow(
          'Layout with id "textbox1" not found',
        );
      });
    });
  });

  describe('addText', () => {
    describe('normal cases', () => {
      test('adds text to TextBox with only required fields', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const textWidget = text({ content: 'Hello, World!' });

        // Act
        manager.addText(textWidget, 'textbox1');

        // Assert
        expect(manager.hasId('textbox1')).toBe(true);
        const box = manager.widgets[0] as TextBoxWidget;
        expect(box.children).toHaveLength(1);
        expect(box.children[0]).toBe(textWidget);
      });

      test('adds text to TextBox with ID and optional fields', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const textWidget = text({
          id: 'text1',
          content: 'Styled text',
          className: 'font-weight: bold;',
          speed: 50,
        });

        // Act
        manager.addText(textWidget, 'textbox1');

        // Assert
        expect(manager.hasId('textbox1')).toBe(true);
        expect(manager.hasId('text1')).toBe(true);
      });

      test('adds multiple texts to same TextBox', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const text1 = text({ id: 'text1', content: 'First text' });
        const text2 = text({ id: 'text2', content: 'Second text' });

        // Act
        manager.addText(text1, 'textbox1');
        manager.addText(text2, 'textbox1');

        // Assert
        expect(manager.hasId('text1')).toBe(true);
        expect(manager.hasId('text2')).toBe(true);
        expect(manager.hasId('textbox1')).toBe(true);
      });

      test('adds text to TextBox nested in Layout', () => {
        // Arrange
        const manager = new WidgetManager();
        const parentLayout = layout({ id: 'parent' })([]);
        manager.addWidget(parentLayout);
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget, 'parent');
        const textWidget = text({ id: 'text1', content: 'Nested text' });

        // Act
        manager.addText(textWidget, 'textbox1');

        // Assert
        expect(manager.hasId('text1')).toBe(true);
        expect(manager.hasId('textbox1')).toBe(true);
      });
    });

    describe('error cases', () => {
      test('throws error when adding text with duplicate ID', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const text1 = text({ id: 'duplicate', content: 'First text' });
        manager.addText(text1, 'textbox1');
        const text2 = text({ id: 'duplicate', content: 'Second text' });

        // Act & Assert
        expect(() => manager.addText(text2, 'textbox1')).toThrow(
          'Widget with id "duplicate" already exists',
        );
      });

      test('throws error when textBoxId does not exist', () => {
        // Arrange
        const manager = new WidgetManager();
        const textWidget = text({ content: 'Hello' });

        // Act & Assert
        expect(() => manager.addText(textWidget, 'non-existent')).toThrow(
          'TextBox with id "non-existent" not found',
        );
      });

      test('throws error when textBoxId points to non-TextBox widget', () => {
        // Arrange
        const manager = new WidgetManager();
        const layoutWidget = layout({ id: 'layout1' })([]);
        manager.addWidget(layoutWidget);
        const textWidget = text({ content: 'Hello' });

        // Act & Assert
        expect(() => manager.addText(textWidget, 'layout1')).toThrow(
          'TextBox with id "layout1" not found',
        );
      });

      test('throws error when text ID conflicts with existing widget ID', () => {
        // Arrange
        const manager = new WidgetManager();
        const existingLayout = layout({ id: 'existing-widget' })([]);
        manager.addWidget(existingLayout);
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const textWidget = text({ id: 'existing-widget', content: 'Text' });

        // Act & Assert
        expect(() => manager.addText(textWidget, 'textbox1')).toThrow(
          'Widget with id "existing-widget" already exists',
        );
      });
    });
  });

  describe('hasId', () => {
    describe('normal cases', () => {
      test('finds ID at root level', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget = img({ id: 'root-img', src: 'test.png' });
        manager.addWidget(widget);

        // Act & Assert
        expect(manager.hasId('root-img')).toBe(true);
      });

      test('finds ID in nested Layout', () => {
        // Arrange
        const manager = new WidgetManager();
        const parentLayout = layout({ id: 'parent' })([]);
        manager.addWidget(parentLayout);
        const childWidget = img({ id: 'child-img', src: 'test.png' });
        manager.addWidget(childWidget, 'parent');

        // Act & Assert
        expect(manager.hasId('child-img')).toBe(true);
      });

      test('finds ID in deeply nested structure', () => {
        // Arrange
        const manager = new WidgetManager();
        const level1 = layout({ id: 'level1' })([]);
        manager.addWidget(level1);
        const level2 = layout({ id: 'level2' })([]);
        manager.addWidget(level2, 'level1');
        const level3 = img({ id: 'level3', src: 'test.png' });
        manager.addWidget(level3, 'level2');

        // Act & Assert
        expect(manager.hasId('level3')).toBe(true);
      });

      test('finds ID in TextBox children', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const textWidget = text({ id: 'text1', content: 'Hello' });
        manager.addText(textWidget, 'textbox1');

        // Act & Assert
        expect(manager.hasId('text1')).toBe(true);
      });

      test('returns false for non-existent ID', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget = img({ id: 'img1', src: 'test.png' });
        manager.addWidget(widget);

        // Act & Assert
        expect(manager.hasId('non-existent')).toBe(false);
      });

      test('returns false when searching in widgets without IDs', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget = img({ src: 'test.png' }); // No ID
        manager.addWidget(widget);

        // Act & Assert
        expect(manager.hasId('any-id')).toBe(false);
      });
    });
  });

  describe('clearTextBox', () => {
    describe('normal cases', () => {
      test('clears TextBox with texts', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const text1 = text({ id: 'text1', content: 'First' });
        const text2 = text({ id: 'text2', content: 'Second' });
        manager.addText(text1, 'textbox1');
        manager.addText(text2, 'textbox1');

        // Act
        manager.clearTextBox('textbox1');

        // Assert
        expect(manager.hasId('textbox1')).toBe(true);
        expect(manager.hasId('text1')).toBe(false);
        expect(manager.hasId('text2')).toBe(false);
      });

      test('clears empty TextBox without error', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);

        // Act & Assert
        expect(() => manager.clearTextBox('textbox1')).not.toThrow();
        expect(manager.hasId('textbox1')).toBe(true);
      });

      test('clears TextBox nested in Layout', () => {
        // Arrange
        const manager = new WidgetManager();
        const parentLayout = layout({ id: 'parent' })([]);
        manager.addWidget(parentLayout);
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget, 'parent');
        const textWidget = text({ id: 'text1', content: 'Hello' });
        manager.addText(textWidget, 'textbox1');

        // Act
        manager.clearTextBox('textbox1');

        // Assert
        expect(manager.hasId('textbox1')).toBe(true);
        expect(manager.hasId('text1')).toBe(false);
      });
    });

    describe('error cases', () => {
      test('throws error when textBoxId does not exist', () => {
        // Arrange
        const manager = new WidgetManager();

        // Act & Assert
        expect(() => manager.clearTextBox('non-existent')).toThrow(
          'TextBox with id "non-existent" not found',
        );
      });

      test('throws error when ID points to non-TextBox widget', () => {
        // Arrange
        const manager = new WidgetManager();
        const layoutWidget = layout({ id: 'layout1' })([]);
        manager.addWidget(layoutWidget);

        // Act & Assert
        expect(() => manager.clearTextBox('layout1')).toThrow(
          'TextBox with id "layout1" not found',
        );
      });
    });
  });

  describe('removeById', () => {
    describe('normal cases', () => {
      test('removes widget at root level', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget = img({ id: 'img1', src: 'test.png' });
        manager.addWidget(widget);

        // Act
        manager.removeById('img1');

        // Assert
        expect(manager.hasId('img1')).toBe(false);
        expect(manager.widgets).toHaveLength(0);
      });

      test('removes nested widget in Layout', () => {
        // Arrange
        const manager = new WidgetManager();
        const parentLayout = layout({ id: 'parent' })([]);
        manager.addWidget(parentLayout);
        const childWidget = img({ id: 'child', src: 'test.png' });
        manager.addWidget(childWidget, 'parent');

        // Act
        manager.removeById('child');

        // Assert
        expect(manager.hasId('parent')).toBe(true);
        expect(manager.hasId('child')).toBe(false);
      });

      test('removes deeply nested widget', () => {
        // Arrange
        const manager = new WidgetManager();
        const level1 = layout({ id: 'level1' })([]);
        manager.addWidget(level1);
        const level2 = layout({ id: 'level2' })([]);
        manager.addWidget(level2, 'level1');
        const level3 = img({ id: 'level3', src: 'test.png' });
        manager.addWidget(level3, 'level2');

        // Act
        manager.removeById('level3');

        // Assert
        expect(manager.hasId('level1')).toBe(true);
        expect(manager.hasId('level2')).toBe(true);
        expect(manager.hasId('level3')).toBe(false);
      });

      test('removes text from TextBox', () => {
        // Arrange
        const manager = new WidgetManager();
        const textBoxWidget = textBox({ id: 'textbox1' })([]);
        manager.addWidget(textBoxWidget);
        const textWidget = text({ id: 'text1', content: 'Hello' });
        manager.addText(textWidget, 'textbox1');

        // Act
        manager.removeById('text1');

        // Assert
        expect(manager.hasId('textbox1')).toBe(true);
        expect(manager.hasId('text1')).toBe(false);
      });

      test('removes one widget among multiple widgets', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget1 = img({ id: 'img1', src: 'test1.png' });
        const widget2 = img({ id: 'img2', src: 'test2.png' });
        const widget3 = img({ id: 'img3', src: 'test3.png' });
        manager.addWidget(widget1);
        manager.addWidget(widget2);
        manager.addWidget(widget3);

        // Act
        manager.removeById('img2');

        // Assert
        expect(manager.hasId('img1')).toBe(true);
        expect(manager.hasId('img2')).toBe(false);
        expect(manager.hasId('img3')).toBe(true);
        expect(manager.widgets).toHaveLength(2);
      });

      test('removes parent Layout with all its children', () => {
        // Arrange
        const manager = new WidgetManager();
        const parentLayout = layout({ id: 'parent' })([]);
        manager.addWidget(parentLayout);
        const child1 = img({ id: 'child1', src: 'test1.png' });
        const child2 = img({ id: 'child2', src: 'test2.png' });
        manager.addWidget(child1, 'parent');
        manager.addWidget(child2, 'parent');

        // Act
        manager.removeById('parent');

        // Assert
        expect(manager.hasId('parent')).toBe(false);
        expect(manager.hasId('child1')).toBe(false);
        expect(manager.hasId('child2')).toBe(false);
        expect(manager.widgets).toHaveLength(0);
      });
    });

    describe('error cases', () => {
      test('throws error when ID does not exist', () => {
        // Arrange
        const manager = new WidgetManager();

        // Act & Assert
        expect(() => manager.removeById('non-existent')).toThrow(
          'Widget with id "non-existent" not found',
        );
      });

      test('throws error when trying to remove already removed widget', () => {
        // Arrange
        const manager = new WidgetManager();
        const widget = img({ id: 'img1', src: 'test.png' });
        manager.addWidget(widget);
        manager.removeById('img1');

        // Act & Assert
        expect(() => manager.removeById('img1')).toThrow(
          'Widget with id "img1" not found',
        );
      });
    });
  });
});
