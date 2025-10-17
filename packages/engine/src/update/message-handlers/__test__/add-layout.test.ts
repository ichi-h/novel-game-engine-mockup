import { describe, expect, test } from 'bun:test';
import { initModel } from '../../../model';
import { img, layout } from '../../../objects';
import { type AddLayoutMessage, handleAddLayout } from '../add-layout';
import { mockMixer } from './test-utils';

describe('handleAddLayout - normal cases', () => {
  test('adds layout to root without style', () => {
    // Arrange
    const model = initModel(mockMixer);
    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'layout1',
    };

    // Act
    const result = handleAddLayout(model, msg);

    // Assert
    expect(result).toBe(model); // Returns the same model instance
    expect(result.ui.objects).toHaveLength(1);
    expect(result.ui.hasId('layout1')).toBe(true);
  });

  test('adds layout to root with style', () => {
    // Arrange
    const model = initModel(mockMixer);
    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'layout2',
      style: 'display: flex; justify-content: center;',
    };

    // Act
    const result = handleAddLayout(model, msg);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.objects).toHaveLength(1);
    expect(result.ui.hasId('layout2')).toBe(true);
    expect(
      result.ui.objects[0] !== undefined && 'style' in result.ui.objects[0],
    ).toBe(true);
  });

  test('adds layout to parent layout', () => {
    // Arrange
    const model = initModel(mockMixer);
    // First, add parent layout
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addObject(parentLayout);

    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'child',
      parentLayoutId: 'parent',
      style: 'padding: 10px;',
    };

    // Act
    const result = handleAddLayout(model, msg);

    // Assert
    expect(result).toBe(model);
    // Root only contains parent (child is nested)
    expect(result.ui.objects).toHaveLength(1);
    // Verify child layout was added
    expect(result.ui.hasId('child')).toBe(true);
  });
});

describe('handleAddLayout - error cases', () => {
  test('throws error for duplicate ID', () => {
    // Arrange
    const model = initModel(mockMixer);
    // Add existing layout
    const existingLayout = layout({ id: 'duplicate-id' })([]);
    model.ui.addObject(existingLayout);

    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'duplicate-id', // Duplicate ID
    };

    // Act & Assert
    expect(() => handleAddLayout(model, msg)).toThrow(
      'Object with id "duplicate-id" already exists',
    );

    // Model is unchanged (only existing one)
    expect(model.ui.objects).toHaveLength(1);
  });

  test('throws error for non-existent parent layout ID', () => {
    // Arrange
    const model = initModel(mockMixer);
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
    expect(model.ui.objects).toHaveLength(0);
  });

  test('throws error when non-layout object ID is specified as parent', () => {
    // Arrange
    const model = initModel(mockMixer);
    // Add Image object
    const imageObject = img({
      id: 'image1',
      src: 'test.png',
    });
    model.ui.addObject(imageObject);

    const msg: AddLayoutMessage = {
      type: 'AddLayout',
      id: 'new-layout',
      parentLayoutId: 'image1', // Specify Image object as parent
    };

    // Act & Assert
    // Image doesn't have children property so it can't be treated as Layout
    expect(() => handleAddLayout(model, msg)).toThrow(
      'Layout with id "image1" not found',
    );

    // Model is unchanged(Imageの1つのみ)
    expect(model.ui.objects).toHaveLength(1);
    expect(model.ui.hasId('image1')).toBe(true);
  });
});
