import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { addWidget, hasId, w } from '@/ui';
import { type AddImageMessage, addImage, handleAddImage } from '../add-image';

describe('addImage', () => {
  describe('normal cases', () => {
    test('creates message with only required fields', () => {
      // Arrange & Act
      const result = addImage({ layoutId: 'parent', src: 'test.png' });

      // Assert
      expect(result).toEqual({
        type: 'ShowImage',
        layoutId: 'parent',
        src: 'test.png',
      });
    });

    test('creates message with all optional fields', () => {
      // Arrange & Act
      const result = addImage({
        layoutId: 'parent',
        src: 'test.png',
        id: 'img1',
        className: 'width: 100px;',
      });

      // Assert
      expect(result).toEqual({
        type: 'ShowImage',
        layoutId: 'parent',
        src: 'test.png',
        id: 'img1',
        className: 'width: 100px;',
      });
    });
  });
});

describe('handleAddImage - normal cases', () => {
  test('adds image with only required fields', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));

    const msg: AddImageMessage = {
      type: 'ShowImage',
      layoutId: 'parent',
      src: 'test.png',
    };

    // Act
    const result = handleAddImage(model, msg);

    // Assert
    // Verify parent layout still exists
    expect(hasId(result.ui, 'parent')).toBe(true);
  });

  test('adds image with all optional fields', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));

    const msg: AddImageMessage = {
      type: 'ShowImage',
      id: 'img-all',
      layoutId: 'parent',
      src: 'test.png',
      className: 'width:100px; height:50px;',
    };

    // Act
    const result = handleAddImage(model, msg);

    // Assert
    expect(hasId(result.ui, 'img-all')).toBe(true);
    expect(hasId(result.ui, 'parent')).toBe(true);
  });

  test('adds multiple images to same layout', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));

    const msg1: AddImageMessage = {
      type: 'ShowImage',
      id: 'img1',
      layoutId: 'parent',
      src: 'sprite1.png',
    };

    const msg2: AddImageMessage = {
      type: 'ShowImage',
      id: 'img2',
      layoutId: 'parent',
      src: 'sprite2.png',
    };

    // Act
    let result = handleAddImage(model, msg1);
    result = handleAddImage(result, msg2);

    // Assert
    expect(hasId(result.ui, 'img1')).toBe(true);
    expect(hasId(result.ui, 'img2')).toBe(true);
    expect(hasId(result.ui, 'parent')).toBe(true);
  });
});

describe('handleAddImage - error cases', () => {
  test('throws error for duplicate image ID', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));

    const msg1: AddImageMessage = {
      type: 'ShowImage',
      id: 'duplicate-img',
      layoutId: 'parent',
      src: 'sprite1.png',
    };

    const newModel = handleAddImage(model, msg1);

    const msg2: AddImageMessage = {
      type: 'ShowImage',
      id: 'duplicate-img',
      layoutId: 'parent',
      src: 'sprite2.png',
    };

    // Act & Assert
    expect(() => handleAddImage(newModel, msg2)).toThrow(
      'Widget with id "duplicate-img" already exists',
    );

    // Model contains only first image
    expect(hasId(newModel.ui, 'duplicate-img')).toBe(true);
  });

  test('throws error for non-existent layoutId', () => {
    // Arrange
    const model = generateInitModel();

    const msg: AddImageMessage = {
      type: 'ShowImage',
      layoutId: 'no-layout',
      src: 'test.png',
    };

    // Act & Assert
    expect(() => handleAddImage(model, msg)).toThrow(
      'Layout with id "no-layout" not found',
    );

    // Model is unchanged
    expect(model.ui).toHaveLength(0);
  });

  test('throws error when image ID conflicts with existing widget ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add existing widget with id 'existing-widget'
    model.ui = addWidget(model.ui, w.layout({ id: 'existing-widget' })([]));
    // Add a layout to host images
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));

    const msg: AddImageMessage = {
      type: 'ShowImage',
      id: 'existing-widget', // Conflicts with existing layout ID
      layoutId: 'parent',
      src: 'test.png',
    };

    // Act & Assert
    expect(() => handleAddImage(model, msg)).toThrow(
      'Widget with id "existing-widget" already exists',
    );
  });
});
