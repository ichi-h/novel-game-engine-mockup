import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { addWidget, hasId, layout, textBox } from '@/ui';
import { handleShowText, type ShowTextMessage, showText } from '../show-text';

describe('showText', () => {
  describe('normal cases', () => {
    test('creates message with only required fields', () => {
      // Arrange & Act
      const result = showText('textbox1', 'Hello, World!');

      // Assert
      expect(result).toEqual({
        type: 'ShowText',
        textBoxId: 'textbox1',
        content: 'Hello, World!',
      });
    });

    test('creates message with all optional fields', () => {
      // Arrange & Act
      const result = showText(
        'textbox1',
        'Hello, World!',
        'text1',
        'font-weight: bold;',
        50,
      );

      // Assert
      expect(result).toEqual({
        type: 'ShowText',
        textBoxId: 'textbox1',
        content: 'Hello, World!',
        id: 'text1',
        style: 'font-weight: bold;',
        speed: 50,
      });
    });
  });
});

describe('handleShowText - normal cases', () => {
  test('adds text to text box with only required fields', () => {
    // Arrange
    const model = generateInitModel();
    // First, add parent layout and text box
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowTextMessage = {
      type: 'ShowText',
      textBoxId: 'textbox1',
      content: 'Hello, World!',
    };

    // Act
    const result = handleShowText(model, msg);

    // Assert
    // Verify text box still exists
    expect(hasId(result.ui, 'textbox1')).toBe(true);
  });

  test('adds text to text box with id', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowTextMessage = {
      type: 'ShowText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'Hello with ID',
    };

    // Act
    const result = handleShowText(model, msg);

    // Assert
    expect(hasId(result.ui, 'text1')).toBe(true);
    expect(hasId(result.ui, 'textbox1')).toBe(true);
  });

  test('adds text to text box with all optional fields', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowTextMessage = {
      type: 'ShowText',
      id: 'text-all',
      textBoxId: 'textbox1',
      content: 'Complete text',
      style: 'font-weight: bold;',
      speed: 50,
    };

    // Act
    const result = handleShowText(model, msg);

    // Assert
    expect(hasId(result.ui, 'text-all')).toBe(true);
    expect(hasId(result.ui, 'textbox1')).toBe(true);
  });

  test('adds multiple texts to same text box', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'textbox1' })([]), 'parent');

    const msg1: ShowTextMessage = {
      type: 'ShowText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'First text',
    };

    const msg2: ShowTextMessage = {
      type: 'ShowText',
      id: 'text2',
      textBoxId: 'textbox1',
      content: 'Second text',
    };

    // Act
    let result = handleShowText(model, msg1);
    result = handleShowText(result, msg2);

    // Assert
    expect(hasId(result.ui, 'text1')).toBe(true);
    expect(hasId(result.ui, 'text2')).toBe(true);
    expect(hasId(result.ui, 'textbox1')).toBe(true);
  });
});

describe('handleShowText - error cases', () => {
  test('throws error for duplicate text ID', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'textbox1' })([]), 'parent');

    // Add first text
    const msg1: ShowTextMessage = {
      type: 'ShowText',
      id: 'duplicate-text',
      textBoxId: 'textbox1',
      content: 'First text',
    };
    const newModel = handleShowText(model, msg1);

    // Try to add text with duplicate ID
    const msg2: ShowTextMessage = {
      type: 'ShowText',
      id: 'duplicate-text',
      textBoxId: 'textbox1',
      content: 'Second text',
    };

    // Act & Assert
    expect(() => handleShowText(newModel, msg2)).toThrow(
      'Widget with id "duplicate-text" already exists',
    );

    // Model contains only first text
    expect(hasId(newModel.ui, 'duplicate-text')).toBe(true);
  });

  test('throws error for non-existent text box ID', () => {
    // Arrange
    const model = generateInitModel();

    const msg: ShowTextMessage = {
      type: 'ShowText',
      textBoxId: 'non-existent-textbox',
      content: 'Hello',
    };

    // Act & Assert
    expect(() => handleShowText(model, msg)).toThrow(
      'TextBox with id "non-existent-textbox" not found',
    );

    // Model is unchanged
    expect(model.ui).toHaveLength(0);
  });

  test('throws error when text ID conflicts with existing widget ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add layout
    model.ui = addWidget(model.ui, layout({ id: 'existing-widget' })([]));
    // Add text box
    model.ui = addWidget(
      model.ui,
      textBox({ id: 'textbox1' })([]),
      'existing-widget',
    );

    const msg: ShowTextMessage = {
      type: 'ShowText',
      id: 'existing-widget', // Conflicts with layout ID
      textBoxId: 'textbox1',
      content: 'Text',
    };

    // Act & Assert
    expect(() => handleShowText(model, msg)).toThrow(
      'Widget with id "existing-widget" already exists',
    );
  });
});
