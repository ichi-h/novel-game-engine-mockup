import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { addWidget, hasId, w } from '@/ui';
import {
  type AddLayoutMessage,
  addLayout,
  handleAddLayout,
} from '../add-layout';

describe('addLayout', () => {
  describe('normal cases', () => {
    test('creates message with only required fields', () => {
      // Arrange & Act
      const result = addLayout({ id: 'layout1' });

      // Assert
      expect(result).toEqual({
        type: 'AddLayout',
        id: 'layout1',
      });
    });

    test('creates message with all optional fields', () => {
      // Arrange & Act
      const result = addLayout({
        id: 'layout1',
        parentLayoutId: 'parent',
        className: 'display: flex;',
      });

      // Assert
      expect(result).toEqual({
        type: 'AddLayout',
        id: 'layout1',
        parentLayoutId: 'parent',
        className: 'display: flex;',
      });
    });
  });
});

describe('handleAddLayout - normal cases', () => {
  test('adds layout to root without style', () => {
    // Arrange
    const model = generateInitModel();
    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'layout1',
    };

    // Act
    const result = handleAddLayout(model, msg);

    // Assert
    expect(result.ui).toHaveLength(1);
    expect(hasId(result.ui, 'layout1')).toBe(true);
  });

  test('adds layout to root with style', () => {
    // Arrange
    const model = generateInitModel();
    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'layout2',
      className: 'display: flex; justify-content: center;',
    };

    // Act
    const result = handleAddLayout(model, msg);

    // Assert
    expect(result.ui).toHaveLength(1);
    expect(hasId(result.ui, 'layout2')).toBe(true);
    expect(result.ui[0] !== undefined && 'style' in result.ui[0]).toBe(true);
  });

  test('adds layout to parent layout', () => {
    // Arrange
    const model = generateInitModel();
    // First, add parent layout
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));

    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'child',
      parentLayoutId: 'parent',
      className: 'padding: 10px;',
    };

    // Act
    const result = handleAddLayout(model, msg);

    // Assert
    // Root only contains parent (child is nested)
    expect(result.ui).toHaveLength(1);
    // Verify child layout was added
    expect(hasId(result.ui, 'child')).toBe(true);
  });
});

describe('handleAddLayout - error cases', () => {
  test('throws error for duplicate ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add existing layout
    model.ui = addWidget(model.ui, w.layout({ id: 'duplicate-id' })([]));

    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'duplicate-id', // Duplicate ID
    };

    // Act & Assert
    expect(() => handleAddLayout(model, msg)).toThrow(
      'Widget with id "duplicate-id" already exists',
    );

    // Model is unchanged (only existing one)
    expect(model.ui).toHaveLength(1);
  });

  test('throws error for non-existent parent layout ID', () => {
    // Arrange
    const model = generateInitModel();
    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'new-layout',
      parentLayoutId: 'non-existent-parent',
    };

    // Act & Assert
    expect(() => handleAddLayout(model, msg)).toThrow(
      'Layout with id "non-existent-parent" not found',
    );

    // Model is unchanged
    expect(model.ui).toHaveLength(0);
  });

  test('throws error when non-layout widget ID is specified as parent', () => {
    // Arrange
    const model = generateInitModel();
    // Add Image widget
    model.ui = addWidget(model.ui, w.img({ id: 'image1', src: 'test.png' }));

    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'new-layout',
      parentLayoutId: 'image1', // Specify Image widget as parent
    };

    // Act & Assert
    // Image doesn't have children property so it can't be treated as Layout
    expect(() => handleAddLayout(model, msg)).toThrow(
      'Layout with id "image1" not found',
    );

    // Model is unchanged(Imageの1つのみ)
    expect(model.ui).toHaveLength(1);
    expect(hasId(model.ui, 'image1')).toBe(true);
  });
});
