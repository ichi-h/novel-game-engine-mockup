import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { addWidget, hasId, layout, textBox } from '@/ui';
import {
  handleRemoveWidgets,
  type RemoveWidgetsMessage,
  removeWidgets,
} from '../remove-widgets';

describe('removeWidgets', () => {
  describe('normal cases', () => {
    test('creates message with required fields', () => {
      // Arrange & Act
      const result = removeWidgets(['widget1', 'widget2']);

      // Assert
      expect(result).toEqual({
        type: 'RemoveWidgets',
        ids: ['widget1', 'widget2'],
      });
    });
  });
});

describe('handleRemoveWidgets - normal cases', () => {
  test('removes single widget', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'textbox1' })([]), 'parent');

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: ['textbox1'],
    };

    // Act
    const result = handleRemoveWidgets(model, msg);

    // Assert
    expect(hasId(result.ui, 'textbox1')).toBe(false);
    expect(hasId(result.ui, 'parent')).toBe(true);
  });

  test('removes multiple widgets', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'textbox1' })([]), 'parent');
    model.ui = addWidget(model.ui, textBox({ id: 'textbox2' })([]), 'parent');

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: ['textbox1', 'textbox2'],
    };

    // Act
    const result = handleRemoveWidgets(model, msg);

    // Assert
    expect(hasId(result.ui, 'textbox1')).toBe(false);
    expect(hasId(result.ui, 'textbox2')).toBe(false);
    expect(hasId(result.ui, 'parent')).toBe(true);
  });

  test('removes parent and its children when removing parent', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'childA' })([]), 'parent');

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: ['parent'],
    };

    // Act
    const result = handleRemoveWidgets(model, msg);

    // Assert
    expect(hasId(result.ui, 'parent')).toBe(false);
    expect(hasId(result.ui, 'childA')).toBe(false);
  });

  test('no-op when ids is empty array', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, textBox({ id: 'childA' })([]), 'parent');

    const beforeCount = model.ui.length;

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: [],
    };

    // Act
    const result = handleRemoveWidgets(model, msg);

    // Assert
    expect(result.ui).toHaveLength(beforeCount);
  });
});

describe('handleRemoveWidgets - error cases', () => {
  test('throws error for non-existent id', () => {
    // Arrange
    const model = generateInitModel();

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: ['non-existent-id'],
    };

    // Act & Assert
    expect(() => handleRemoveWidgets(model, msg)).toThrow(
      'Widget with id "non-existent-id" not found',
    );

    // Model unchanged
    expect(model.ui).toHaveLength(0);
  });
});
