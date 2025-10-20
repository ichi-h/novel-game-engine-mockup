import { describe, expect, test } from 'bun:test';
import { initModel } from '@/model';
import { layout, textBox } from '@/ui';
import {
  handleRemoveWidgets,
  type RemoveWidgetsMessage,
} from '../remove-widgets';
import { mockMixer } from './test-utils';

describe('handleRemoveWidgets - normal cases', () => {
  test('removes single widget', () => {
    // Arrange
    const model = initModel(mockMixer);
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const textBoxWidget = textBox({ id: 'textbox1' })([]);
    model.ui.addWidget(textBoxWidget, 'parent');

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: ['textbox1'],
    };

    // Act
    const result = handleRemoveWidgets(model, msg);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.hasId('textbox1')).toBe(false);
    expect(result.ui.hasId('parent')).toBe(true);
  });

  test('removes multiple widgets', () => {
    // Arrange
    const model = initModel(mockMixer);
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const t1 = textBox({ id: 'textbox1' })([]);
    const t2 = textBox({ id: 'textbox2' })([]);
    model.ui.addWidget(t1, 'parent');
    model.ui.addWidget(t2, 'parent');

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: ['textbox1', 'textbox2'],
    };

    // Act
    const result = handleRemoveWidgets(model, msg);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.hasId('textbox1')).toBe(false);
    expect(result.ui.hasId('textbox2')).toBe(false);
    expect(result.ui.hasId('parent')).toBe(true);
  });

  test('removes parent and its children when removing parent', () => {
    // Arrange
    const model = initModel(mockMixer);
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const child = textBox({ id: 'childA' })([]);
    model.ui.addWidget(child, 'parent');

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: ['parent'],
    };

    // Act
    const result = handleRemoveWidgets(model, msg);

    // Assert
    expect(result).toBe(model);
    expect(result.ui.hasId('parent')).toBe(false);
    expect(result.ui.hasId('childA')).toBe(false);
  });

  test('no-op when ids is empty array', () => {
    // Arrange
    const model = initModel(mockMixer);
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);
    const child = textBox({ id: 'childA' })([]);
    model.ui.addWidget(child, 'parent');

    const beforeCount = model.ui.widgets.length;

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: [],
    };

    // Act
    const result = handleRemoveWidgets(model, msg);

    // Assert
    expect(result).toBe(model);
    expect(model.ui.widgets).toHaveLength(beforeCount);
  });
});

describe('handleRemoveWidgets - error cases', () => {
  test('throws error for non-existent id', () => {
    // Arrange
    const model = initModel(mockMixer);

    const msg: RemoveWidgetsMessage = {
      type: 'RemoveWidgets',
      ids: ['non-existent-id'],
    };

    // Act & Assert
    expect(() => handleRemoveWidgets(model, msg)).toThrow(
      'Widget with id "non-existent-id" not found',
    );

    // Model unchanged
    expect(model.ui.widgets).toHaveLength(0);
  });
});
