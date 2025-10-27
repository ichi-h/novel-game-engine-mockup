import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { layout, text, textBox } from '@/ui';
import {
  type ClearTextBoxMessage,
  handleClearTextBox,
} from '../clear-text-box';

describe('handleClearTextBox - normal cases', () => {
  test('clears empty text box', () => {
    // Arrange
    const model = generateInitModel();
    // Add parent layout
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    // Add text box without any text
    const textBoxWidget = textBox({ id: 'textbox1' })([]);
    model.ui.addWidget(textBoxWidget, 'parent');

    const msg: ClearTextBoxMessage = {
      type: 'ClearTextBox',
      textBoxId: 'textbox1',
    };

    // Act
    const result = handleClearTextBox(model, msg);

    // Assert
    expect(result).toBe(model);
    // Verify text box still exists
    expect(result.ui.hasId('textbox1')).toBe(true);
  });

  test('clears text box with multiple texts', () => {
    // Arrange
    const model = generateInitModel();
    // Add parent layout
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    // Add text box with multiple texts
    const text1 = text({ id: 'text1', content: 'First text' });
    const text2 = text({ id: 'text2', content: 'Second text' });
    const text3 = text({ id: 'text3', content: 'Third text' });
    const textBoxWidget = textBox({ id: 'textbox1' })([text1, text2, text3]);
    model.ui.addWidget(textBoxWidget, 'parent');

    const msg: ClearTextBoxMessage = {
      type: 'ClearTextBox',
      textBoxId: 'textbox1',
    };

    // Act
    const result = handleClearTextBox(model, msg);

    // Assert
    expect(result).toBe(model);
    // Verify text box still exists
    expect(result.ui.hasId('textbox1')).toBe(true);
    // Verify all texts have been removed
    expect(result.ui.hasId('text1')).toBe(false);
    expect(result.ui.hasId('text2')).toBe(false);
    expect(result.ui.hasId('text3')).toBe(false);
  });
});

describe('handleClearTextBox - error cases', () => {
  test('throws error for non-existent text box ID', () => {
    // Arrange
    const model = generateInitModel();

    const msg: ClearTextBoxMessage = {
      type: 'ClearTextBox',
      textBoxId: 'non-existent-textbox',
    };

    // Act & Assert
    expect(() => handleClearTextBox(model, msg)).toThrow(
      'TextBox with id "non-existent-textbox" not found',
    );

    // Model is unchanged
    expect(model.ui.widgets).toHaveLength(0);
  });

  test('throws error when ID is not a text box', () => {
    // Arrange
    const model = generateInitModel();
    // Add layout (not a text box)
    const layoutWidget = layout({ id: 'not-a-textbox' })([]);
    model.ui.addWidget(layoutWidget);

    const msg: ClearTextBoxMessage = {
      type: 'ClearTextBox',
      textBoxId: 'not-a-textbox',
    };

    // Act & Assert
    expect(() => handleClearTextBox(model, msg)).toThrow(
      'TextBox with id "not-a-textbox" not found',
    );

    // Verify layout still exists and is unchanged
    expect(model.ui.hasId('not-a-textbox')).toBe(true);
  });
});
