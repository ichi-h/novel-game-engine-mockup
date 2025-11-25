import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { img, layout } from '@/ui';
import {
  type AddWidgetsMessage,
  addWidgets,
  handleAddWidgets,
} from '../add-widgets';

describe('addWidgets', () => {
  describe('normal cases', () => {
    test('creates message without layoutId', () => {
      // Arrange
      const widgets = [
        img({ id: 'img1', src: 'test1.png' }),
        img({ id: 'img2', src: 'test2.png' }),
      ];

      // Act
      const result = addWidgets(widgets);

      // Assert
      expect(result).toEqual({
        type: 'AddWidgets',
        widgets,
      });
    });

    test('creates message with layoutId', () => {
      // Arrange
      const widgets = [
        img({ id: 'img1', src: 'test1.png' }),
        img({ id: 'img2', src: 'test2.png' }),
      ];
      const layoutId = 'parent-layout';

      // Act
      const result = addWidgets(widgets, layoutId);

      // Assert
      expect(result).toEqual({
        type: 'AddWidgets',
        widgets,
        layoutId,
      });
    });
  });
});

describe('handleAddWidgets - normal cases', () => {
  test('adds widgets to root without layoutId', () => {
    // Arrange
    const model = generateInitModel();
    const widgets = [
      img({ id: 'img1', src: 'test1.png' }),
      img({ id: 'img2', src: 'test2.png' }),
    ];
    const msg: AddWidgetsMessage<unknown> = {
      type: 'AddWidgets',
      widgets,
    };

    // Act
    const result = handleAddWidgets(model, msg);

    // Assert
    expect(result).toBe(model); // Returns the same model instance
    expect(result.ui.widgets).toHaveLength(2);
    expect(result.ui.hasId('img1')).toBe(true);
    expect(result.ui.hasId('img2')).toBe(true);
  });

  test('adds widgets to parent layout with layoutId', () => {
    // Arrange
    const model = generateInitModel();
    // First, add parent layout
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const widgets = [
      img({ id: 'img1', src: 'test1.png' }),
      img({ id: 'img2', src: 'test2.png' }),
    ];
    const msg: AddWidgetsMessage<unknown> = {
      type: 'AddWidgets',
      widgets,
      layoutId: 'parent',
    };

    // Act
    const result = handleAddWidgets(model, msg);

    // Assert
    expect(result).toBe(model);
    // Root only contains parent (widgets are nested)
    expect(result.ui.widgets).toHaveLength(1);
    // Verify widgets were added
    expect(result.ui.hasId('img1')).toBe(true);
    expect(result.ui.hasId('img2')).toBe(true);
  });

  test('handles empty widgets array without errors', () => {
    // Arrange
    const model = generateInitModel();
    const msg: AddWidgetsMessage<unknown> = {
      type: 'AddWidgets',
      widgets: [],
    };

    // Act
    const result = handleAddWidgets(model, msg);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.widgets).toHaveLength(0);
  });
});

describe('handleAddWidgets - error cases', () => {
  test('throws error for duplicate widget ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add existing widget
    const existingWidget = img({ id: 'duplicate-id', src: 'existing.png' });
    model.ui.addWidget(existingWidget);

    const widgets = [img({ id: 'duplicate-id', src: 'new.png' })];
    const msg: AddWidgetsMessage<unknown> = {
      type: 'AddWidgets',
      widgets,
    };

    // Act & Assert
    expect(() => handleAddWidgets(model, msg)).toThrow(
      'Widget with id "duplicate-id" already exists',
    );

    // Model is unchanged (only existing widget)
    expect(model.ui.widgets).toHaveLength(1);
  });

  test('throws error for non-existent parent layout ID', () => {
    // Arrange
    const model = generateInitModel();
    const widgets = [img({ id: 'img1', src: 'test.png' })];
    const msg: AddWidgetsMessage<unknown> = {
      type: 'AddWidgets',
      widgets,
      layoutId: 'non-existent-parent',
    };

    // Act & Assert
    expect(() => handleAddWidgets(model, msg)).toThrow(
      'Layout with id "non-existent-parent" not found',
    );

    // Model is unchanged
    expect(model.ui.widgets).toHaveLength(0);
  });

  test('throws error when non-layout widget ID is specified as parent', () => {
    // Arrange
    const model = generateInitModel();
    // Add Image widget
    const imageWidget = img({
      id: 'image1',
      src: 'test.png',
    });
    model.ui.addWidget(imageWidget);

    const widgets = [img({ id: 'img1', src: 'new.png' })];
    const msg: AddWidgetsMessage<unknown> = {
      type: 'AddWidgets',
      widgets,
      layoutId: 'image1', // Specify Image widget as parent
    };

    // Act & Assert
    expect(() => handleAddWidgets(model, msg)).toThrow(
      'Layout with id "image1" not found',
    );

    // Model is unchanged (only the image widget)
    expect(model.ui.widgets).toHaveLength(1);
    expect(model.ui.hasId('image1')).toBe(true);
  });
});
