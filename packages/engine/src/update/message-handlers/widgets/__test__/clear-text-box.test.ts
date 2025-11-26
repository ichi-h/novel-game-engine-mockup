import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { addWidget, hasId, layout, text, textBox } from '@/ui';
import {
  type ClearTextBoxMessage,
  clearTextBox,
  handleClearTextBox,
} from '../clear-text-box';

describe('clearTextBox', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange & Act
      const result = clearTextBox('textbox1');

      // Assert
      expect(result).toEqual({
        type: 'ClearTextBox',
        textBoxId: 'textbox1',
      });
    });
  });
});

describe('handleClearTextBox - normal cases', () => {
  test('clears empty text box', () => {
    // Arrange
    const model = generateInitModel();
    // Add parent layout
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    // Add text box without any text
    model.ui = addWidget(model.ui, textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ClearTextBoxMessage = {
      type: 'ClearTextBox',
      textBoxId: 'textbox1',
    };

    // Act
    const result = handleClearTextBox(model, msg);

    // Assert
    // Verify text box still exists
    expect(hasId(result.ui, 'textbox1')).toBe(true);
  });

  test('clears text box with multiple texts', () => {
    // Arrange
    const model = generateInitModel();
    // Add parent layout
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    // Add text box with multiple texts
    model.ui = addWidget(
      model.ui,
      textBox({ id: 'textbox1' })([
        text({ id: 'text1', content: 'First text' }),
        text({ id: 'text2', content: 'Second text' }),
        text({ id: 'text3', content: 'Third text' }),
      ]),
      'parent',
    );

    const msg: ClearTextBoxMessage = {
      type: 'ClearTextBox',
      textBoxId: 'textbox1',
    };

    // Act
    const result = handleClearTextBox(model, msg);

    // Assert
    // Verify text box still exists
    expect(hasId(result.ui, 'textbox1')).toBe(true);
    // Verify all texts have been removed
    expect(hasId(result.ui, 'text1')).toBe(false);
    expect(hasId(result.ui, 'text2')).toBe(false);
    expect(hasId(result.ui, 'text3')).toBe(false);
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
    expect(model.ui).toHaveLength(0);
  });

  test('throws error when ID is not a text box', () => {
    // Arrange
    const model = generateInitModel();
    // Add layout (not a text box)
    const layoutWidget = layout({ id: 'not-a-textbox' })([]);
    model.ui = addWidget(model.ui, layoutWidget);

    const msg: ClearTextBoxMessage = {
      type: 'ClearTextBox',
      textBoxId: 'not-a-textbox',
    };

    // Act & Assert
    expect(() => handleClearTextBox(model, msg)).toThrow(
      'TextBox with id "not-a-textbox" not found',
    );

    // Verify layout still exists and is unchanged
    expect(hasId(model.ui, 'not-a-textbox')).toBe(true);
  });
});
