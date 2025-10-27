import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { img, layout } from '@/ui';
import {
  type AddTextBoxMessage,
  addTextBox,
  handleAddTextBox,
} from '../add-text-box';

describe('addTextBox', () => {
  describe('normal cases', () => {
    test('creates message with only required fields', () => {
      // Arrange & Act
      const result = addTextBox('textbox1', 'parent');

      // Assert
      expect(result).toEqual({
        type: 'AddTextBox',
        id: 'textbox1',
        layoutId: 'parent',
      });
    });

    test('creates message with all optional fields', () => {
      // Arrange & Act
      const result = addTextBox('textbox1', 'parent', 'padding: 10px;');

      // Assert
      expect(result).toEqual({
        type: 'AddTextBox',
        id: 'textbox1',
        layoutId: 'parent',
        style: 'padding: 10px;',
      });
    });
  });
});

describe('handleAddTextBox - normal cases', () => {
  test('adds text box to layout', () => {
    // Arrange
    const model = generateInitModel();
    // First, add parent layout
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const msg: AddTextBoxMessage = {
      type: 'AddTextBox',
      id: 'child',
      layoutId: 'parent',
    };

    // Act
    const result = handleAddTextBox(model, msg);

    // Assert
    expect(result).toBe(model);
    // Root only contains parent (child is nested)
    expect(result.ui.widgets).toHaveLength(1);
    // Verify child layout was added
    expect(result.ui.hasId('child')).toBe(true);
  });

  test('adds text box to layout with styles', () => {
    // Arrange
    const model = generateInitModel();
    // First, add parent layout
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const msg: AddTextBoxMessage = {
      type: 'AddTextBox',
      id: 'child',
      layoutId: 'parent',
      style: 'padding: 10px;',
    };

    // Act
    const result = handleAddTextBox(model, msg);

    // Assert
    expect(result).toBe(model);
    // Root only contains parent (child is nested)
    expect(result.ui.widgets).toHaveLength(1);
    // Verify child layout was added
    expect(result.ui.hasId('child')).toBe(true);
  });
});

describe('handleAddTextBox - error cases', () => {
  test('throws error for duplicate ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add existing layout
    const existingLayout = layout({ id: 'duplicate-id' })([]);
    model.ui.addWidget(existingLayout);

    const msg: AddTextBoxMessage = {
      type: 'AddTextBox',
      layoutId: 'duplicate-id',
      id: 'duplicate-id', // Duplicate ID
    };

    // Act & Assert
    expect(() => handleAddTextBox(model, msg)).toThrow(
      'Widget with id "duplicate-id" already exists',
    );

    // Model is unchanged (only existing one)
    expect(model.ui.widgets).toHaveLength(1);
  });

  test('throws error for non-existent parent layout ID', () => {
    // Arrange
    const model = generateInitModel();
    const msg: AddTextBoxMessage = {
      type: 'AddTextBox',
      id: 'new-layout',
      layoutId: 'non-existent-parent',
    };

    // Act & Assert
    expect(() => handleAddTextBox(model, msg)).toThrow(
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

    const msg: AddTextBoxMessage = {
      type: 'AddTextBox',
      id: 'new-layout',
      layoutId: 'image1', // Specify Image widget as parent
    };

    // Act & Assert
    // Image doesn't have children property so it can't be treated as Layout
    expect(() => handleAddTextBox(model, msg)).toThrow(
      'Layout with id "image1" not found',
    );

    // Model is unchanged(Imageの1つのみ)
    expect(model.ui.widgets).toHaveLength(1);
    expect(model.ui.hasId('image1')).toBe(true);
  });
});
