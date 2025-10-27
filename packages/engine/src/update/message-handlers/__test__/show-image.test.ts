import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { layout } from '@/ui';
import {
  handleShowImage,
  type ShowImageMessage,
  showImage,
} from '../show-image';

describe('showImage', () => {
  describe('normal cases', () => {
    test('creates message with only required fields', () => {
      // Arrange & Act
      const result = showImage('parent', 'test.png');

      // Assert
      expect(result).toEqual({
        type: 'ShowImage',
        layoutId: 'parent',
        src: 'test.png',
      });
    });

    test('creates message with all optional fields', () => {
      // Arrange & Act
      const result = showImage('parent', 'test.png', 'img1', 'width: 100px;');

      // Assert
      expect(result).toEqual({
        type: 'ShowImage',
        layoutId: 'parent',
        src: 'test.png',
        id: 'img1',
        style: 'width: 100px;',
      });
    });
  });
});

describe('handleShowImage - normal cases', () => {
  test('adds image with only required fields', () => {
    // Arrange
    const model = generateInitModel();
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const msg: ShowImageMessage = {
      type: 'ShowImage',
      layoutId: 'parent',
      src: 'test.png',
    };

    // Act
    const result = handleShowImage(model, msg);

    // Assert
    expect(result).toBe(model);
    // Verify parent layout still exists
    expect(result.ui.hasId('parent')).toBe(true);
  });

  test('adds image with all optional fields', () => {
    // Arrange
    const model = generateInitModel();
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const msg: ShowImageMessage = {
      type: 'ShowImage',
      id: 'img-all',
      layoutId: 'parent',
      src: 'test.png',
      style: 'width:100px; height:50px;',
    };

    // Act
    const result = handleShowImage(model, msg);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.hasId('img-all')).toBe(true);
    expect(result.ui.hasId('parent')).toBe(true);
  });

  test('adds multiple images to same layout', () => {
    // Arrange
    const model = generateInitModel();
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const msg1: ShowImageMessage = {
      type: 'ShowImage',
      id: 'img1',
      layoutId: 'parent',
      src: 'sprite1.png',
    };

    const msg2: ShowImageMessage = {
      type: 'ShowImage',
      id: 'img2',
      layoutId: 'parent',
      src: 'sprite2.png',
    };

    // Act
    handleShowImage(model, msg1);
    const result = handleShowImage(model, msg2);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.hasId('img1')).toBe(true);
    expect(result.ui.hasId('img2')).toBe(true);
    expect(result.ui.hasId('parent')).toBe(true);
  });
});

describe('handleShowImage - error cases', () => {
  test('throws error for duplicate image ID', () => {
    // Arrange
    const model = generateInitModel();
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const msg1: ShowImageMessage = {
      type: 'ShowImage',
      id: 'duplicate-img',
      layoutId: 'parent',
      src: 'sprite1.png',
    };

    handleShowImage(model, msg1);

    const msg2: ShowImageMessage = {
      type: 'ShowImage',
      id: 'duplicate-img',
      layoutId: 'parent',
      src: 'sprite2.png',
    };

    // Act & Assert
    expect(() => handleShowImage(model, msg2)).toThrow(
      'Widget with id "duplicate-img" already exists',
    );

    // Model contains only first image
    expect(model.ui.hasId('duplicate-img')).toBe(true);
  });

  test('throws error for non-existent layoutId', () => {
    // Arrange
    const model = generateInitModel();

    const msg: ShowImageMessage = {
      type: 'ShowImage',
      layoutId: 'no-layout',
      src: 'test.png',
    };

    // Act & Assert
    expect(() => handleShowImage(model, msg)).toThrow(
      'Layout with id "no-layout" not found',
    );

    // Model is unchanged
    expect(model.ui.widgets).toHaveLength(0);
  });

  test('throws error when image ID conflicts with existing widget ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add existing widget with id 'existing-widget'
    const existingLayout = layout({ id: 'existing-widget' })([]);
    model.ui.addWidget(existingLayout);
    // Add a layout to host images
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const msg: ShowImageMessage = {
      type: 'ShowImage',
      id: 'existing-widget', // Conflicts with existing layout ID
      layoutId: 'parent',
      src: 'test.png',
    };

    // Act & Assert
    expect(() => handleShowImage(model, msg)).toThrow(
      'Widget with id "existing-widget" already exists',
    );
  });
});
