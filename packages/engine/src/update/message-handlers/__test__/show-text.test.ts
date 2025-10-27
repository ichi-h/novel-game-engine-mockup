import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { layout, textBox } from '@/ui';
import { handleShowText, type ShowTextMessage } from '../show-text';

describe('handleShowText - normal cases', () => {
  test('adds text to text box with only required fields', () => {
    // Arrange
    const model = generateInitModel();
    // First, add parent layout and text box
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const textBoxWidget = textBox({ id: 'textbox1' })([]);
    model.ui.addWidget(textBoxWidget, 'parent');

    const msg: ShowTextMessage = {
      type: 'ShowText',
      textBoxId: 'textbox1',
      content: 'Hello, World!',
    };

    // Act
    const result = handleShowText(model, msg);

    // Assert
    expect(result).toBe(model);
    // Verify text box still exists
    expect(result.ui.hasId('textbox1')).toBe(true);
  });

  test('adds text to text box with id', () => {
    // Arrange
    const model = generateInitModel();
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const textBoxWidget = textBox({ id: 'textbox1' })([]);
    model.ui.addWidget(textBoxWidget, 'parent');

    const msg: ShowTextMessage = {
      type: 'ShowText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'Hello with ID',
    };

    // Act
    const result = handleShowText(model, msg);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.hasId('text1')).toBe(true);
    expect(result.ui.hasId('textbox1')).toBe(true);
  });

  test('adds text to text box with all optional fields', () => {
    // Arrange
    const model = generateInitModel();
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const textBoxWidget = textBox({ id: 'textbox1' })([]);
    model.ui.addWidget(textBoxWidget, 'parent');

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
    expect(result).toBe(model);
    expect(result.ui.hasId('text-all')).toBe(true);
    expect(result.ui.hasId('textbox1')).toBe(true);
  });

  test('adds multiple texts to same text box', () => {
    // Arrange
    const model = generateInitModel();
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const textBoxWidget = textBox({ id: 'textbox1' })([]);
    model.ui.addWidget(textBoxWidget, 'parent');

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
    handleShowText(model, msg1);
    const result = handleShowText(model, msg2);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.hasId('text1')).toBe(true);
    expect(result.ui.hasId('text2')).toBe(true);
    expect(result.ui.hasId('textbox1')).toBe(true);
  });
});

describe('handleShowText - error cases', () => {
  test('throws error for duplicate text ID', () => {
    // Arrange
    const model = generateInitModel();
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const textBoxWidget = textBox({ id: 'textbox1' })([]);
    model.ui.addWidget(textBoxWidget, 'parent');

    // Add first text
    const msg1: ShowTextMessage = {
      type: 'ShowText',
      id: 'duplicate-text',
      textBoxId: 'textbox1',
      content: 'First text',
    };
    handleShowText(model, msg1);

    // Try to add text with duplicate ID
    const msg2: ShowTextMessage = {
      type: 'ShowText',
      id: 'duplicate-text',
      textBoxId: 'textbox1',
      content: 'Second text',
    };

    // Act & Assert
    expect(() => handleShowText(model, msg2)).toThrow(
      'Widget with id "duplicate-text" already exists',
    );

    // Model contains only first text
    expect(model.ui.hasId('duplicate-text')).toBe(true);
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
    expect(model.ui.widgets).toHaveLength(0);
  });

  test('throws error when text ID conflicts with existing widget ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add layout
    const existingLayout = layout({ id: 'existing-widget' })([]);
    model.ui.addWidget(existingLayout);
    // Add text box
    const textBoxWidget = textBox({
      id: 'textbox1',
    })([]);
    model.ui.addWidget(textBoxWidget, 'existing-widget');

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
