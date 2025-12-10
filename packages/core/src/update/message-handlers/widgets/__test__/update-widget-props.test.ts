import { describe, expect, test } from 'bun:test';
import { generateInitModel, type NovelModel } from '@/model';
import {
  handleUpdateWidgetProps,
  type UpdateWidgetPropsMessage,
  updateWidgetProps,
} from '../update-widget-props';

describe('updateWidgetProps', () => {
  describe('normal cases', () => {
    test('creates message for Image widget with src update', () => {
      // Arrange
      const widgetId = 'img-1';

      // Act
      const message = updateWidgetProps(widgetId, {
        widgetType: 'Image',
        props: { src: 'new-image.png' },
      });

      // Assert
      expect(message.type).toBe('UpdateWidgetProps');
      expect(message.widgetId).toBe(widgetId);
      expect(message.spec.widgetType).toBe('Image');
      expect(message.spec.props).toEqual({ src: 'new-image.png' });
    });

    test('creates message for Image widget with className update', () => {
      // Arrange
      const widgetId = 'img-1';

      // Act
      const message = updateWidgetProps(widgetId, {
        widgetType: 'Image',
        props: { className: 'fade-in' },
      });

      // Assert
      expect(message.type).toBe('UpdateWidgetProps');
      expect(message.widgetId).toBe(widgetId);
      expect(message.spec.widgetType).toBe('Image');
      expect(message.spec.props).toEqual({ className: 'fade-in' });
    });

    test('creates message for Image widget with multiple props', () => {
      // Arrange
      const widgetId = 'img-1';

      // Act
      const message = updateWidgetProps(widgetId, {
        widgetType: 'Image',
        props: { src: 'new.png', className: 'active' },
      });

      // Assert
      expect(message.spec.props).toEqual({
        src: 'new.png',
        className: 'active',
      });
    });

    test('creates message for Text widget with content update', () => {
      // Arrange
      const widgetId = 'text-1';

      // Act
      const message = updateWidgetProps(widgetId, {
        widgetType: 'Text',
        props: { content: 'Updated text', speed: 100 },
      });

      // Assert
      expect(message.type).toBe('UpdateWidgetProps');
      expect(message.spec.widgetType).toBe('Text');
      expect(message.spec.props).toEqual({
        content: 'Updated text',
        speed: 100,
      });
    });

    test('creates message for Button widget', () => {
      // Arrange
      const widgetId = 'btn-1';
      const onClick = {
        type: 'Next' as const,
        message: { type: 'Delay' as const, durationMs: 100 },
      };

      // Act
      const message = updateWidgetProps(widgetId, {
        widgetType: 'Button',
        props: { label: 'Click me', onClick },
      });

      // Assert
      expect(message.spec.widgetType).toBe('Button');
      expect(message.spec.props).toEqual({ label: 'Click me', onClick });
    });
  });
});

describe('handleUpdateWidgetProps', () => {
  describe('normal cases', () => {
    test('updates src of Image widget at root level', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'img-1',
          type: 'Image',
          src: 'old-image.png',
          className: 'original',
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'img-1',
        spec: {
          widgetType: 'Image',
          props: { src: 'new-image.png' },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert
      expect(result.ui).toHaveLength(1);
      const widget = result.ui[0];
      if (widget?.type === 'Image') {
        expect(widget.src).toBe('new-image.png');
        expect(widget.className).toBe('original'); // unchanged
      }
    });

    test('updates className of Image widget', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'img-1',
          type: 'Image',
          src: 'image.png',
          className: 'old-class',
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'img-1',
        spec: {
          widgetType: 'Image',
          props: { className: 'new-class' },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert
      const widget = result.ui[0];
      if (widget?.type === 'Image') {
        expect(widget.src).toBe('image.png'); // unchanged
        expect(widget.className).toBe('new-class');
      }
    });

    test('updates multiple properties at once', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'img-1',
          type: 'Image',
          src: 'old.png',
          className: 'old',
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'img-1',
        spec: {
          widgetType: 'Image',
          props: { src: 'new.png', className: 'new' },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert
      const widget = result.ui[0];
      if (widget?.type === 'Image') {
        expect(widget.src).toBe('new.png');
        expect(widget.className).toBe('new');
      }
    });

    test('updates Image widget inside Layout', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'layout-1',
          type: 'Layout',
          className: 'container',
          children: [
            {
              id: 'img-1',
              type: 'Image',
              src: 'old.png',
            },
          ],
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'img-1',
        spec: {
          widgetType: 'Image',
          props: { src: 'new.png' },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert
      const layout = result.ui[0];
      if (layout?.type === 'Layout') {
        const img = layout.children[0];
        if (img?.type === 'Image') {
          expect(img.src).toBe('new.png');
        }
      }
    });

    test('updates Text widget inside TextBox', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'textbox-1',
          type: 'TextBox',
          className: 'box',
          children: [
            {
              id: 'text-1',
              type: 'Text',
              content: 'old content',
            },
          ],
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'text-1',
        spec: {
          widgetType: 'Text',
          props: { content: 'new content', speed: 50 },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert
      const textbox = result.ui[0];
      if (textbox?.type === 'TextBox') {
        const text = textbox.children[0];
        if (text?.type === 'Text') {
          expect(text.content).toBe('new content');
          expect(text.speed).toBe(50);
        }
      }
    });

    test('updates only matching widget when multiple widgets exist', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'img-1',
          type: 'Image',
          src: 'first.png',
        },
        {
          id: 'img-2',
          type: 'Image',
          src: 'second.png',
        },
        {
          id: 'img-3',
          type: 'Image',
          src: 'third.png',
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'img-2',
        spec: {
          widgetType: 'Image',
          props: { src: 'updated.png' },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert
      expect(result.ui).toHaveLength(3);
      const img1 = result.ui[0];
      const img2 = result.ui[1];
      const img3 = result.ui[2];
      if (img1?.type === 'Image') expect(img1.src).toBe('first.png');
      if (img2?.type === 'Image') expect(img2.src).toBe('updated.png');
      if (img3?.type === 'Image') expect(img3.src).toBe('third.png');
    });

    test('updates deeply nested widget', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'layout-1',
          type: 'Layout',
          className: 'outer',
          children: [
            {
              id: 'layout-2',
              type: 'Layout',
              className: 'inner',
              children: [
                {
                  id: 'img-deep',
                  type: 'Image',
                  src: 'deep.png',
                },
              ],
            },
          ],
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'img-deep',
        spec: {
          widgetType: 'Image',
          props: { src: 'updated-deep.png', className: 'visible' },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert
      const outer = result.ui[0];
      if (outer?.type === 'Layout') {
        const inner = outer.children[0];
        if (inner?.type === 'Layout') {
          const img = inner.children[0];
          if (img?.type === 'Image') {
            expect(img.src).toBe('updated-deep.png');
            expect(img.className).toBe('visible');
          }
        }
      }
    });
  });

  describe('error cases', () => {
    test('throws error when widgetId does not exist', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'img-1',
          type: 'Image',
          src: 'image.png',
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'non-existent',
        spec: {
          widgetType: 'Image',
          props: { src: 'new.png' },
        },
      };

      // Act & Assert
      expect(() => handleUpdateWidgetProps(model, message)).toThrow(
        'Widget with id "non-existent" not found',
      );
    });

    test('does not update when widgetId exists but widgetType does not match', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'img-1',
          type: 'Image',
          src: 'original.png',
          className: 'original-class',
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'img-1',
        spec: {
          widgetType: 'Text', // Wrong type
          props: { content: 'This should not apply' },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert - Widget should remain unchanged
      const widget = result.ui[0];
      if (widget?.type === 'Image') {
        expect(widget.src).toBe('original.png');
        expect(widget.className).toBe('original-class');
        expect(widget).not.toHaveProperty('content');
      }
    });

    test('silently ignores type mismatch in nested widgets', () => {
      // Arrange
      const model: NovelModel = generateInitModel();
      model.ui = [
        {
          id: 'layout-1',
          type: 'Layout',
          className: 'container',
          children: [
            {
              id: 'btn-1',
              type: 'Button',
              label: 'Original',
              onClick: {
                type: 'Next' as const,
                message: { type: 'Delay' as const, durationMs: 100 },
              },
            },
          ],
        },
      ];
      const message: UpdateWidgetPropsMessage = {
        type: 'UpdateWidgetProps',
        widgetId: 'btn-1',
        spec: {
          widgetType: 'Image', // Wrong type
          props: { src: 'wrong.png' },
        },
      };

      // Act
      const result = handleUpdateWidgetProps(model, message);

      // Assert - Button should remain unchanged
      const layout = result.ui[0];
      if (layout?.type === 'Layout') {
        const btn = layout.children[0];
        if (btn?.type === 'Button') {
          expect(btn.label).toBe('Original');
          expect(btn).not.toHaveProperty('src');
        }
      }
    });
  });
});
