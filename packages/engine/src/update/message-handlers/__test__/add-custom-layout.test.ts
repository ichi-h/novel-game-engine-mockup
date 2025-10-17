import { describe, expect, test } from 'bun:test';
import { initModel } from '@/model';
import { customLayout, img, layout } from '@/ui';
import {
  type AddCustomLayoutMessage,
  handleAddCustomLayout,
} from '../add-custom-layout';
import { mockMixer } from './test-utils';

// Mock component type for testing
interface MockComponent {
  name: string;
  props?: Record<string, unknown>;
}

describe('handleAddCustomLayout - normal cases', () => {
  test('adds custom layout to root', () => {
    // Arrange
    const model = initModel(mockMixer);
    const mockComponent: MockComponent = {
      name: 'TestComponent',
      props: { foo: 'bar' },
    };
    const msg: AddCustomLayoutMessage<MockComponent> = {
      type: 'AddCustomLayout',
      id: 'custom-layout-1',
      component: mockComponent,
    };

    // Act
    const result = handleAddCustomLayout(model, msg);

    // Assert
    expect(result).toBe(model); // Returns the same model instance
    expect(result.ui.widgets).toHaveLength(1);
    expect(result.ui.hasId('custom-layout-1')).toBe(true);
  });

  test('adds custom layout to parent layout', () => {
    // Arrange
    const model = initModel(mockMixer);
    // First, add parent layout
    const parentLayout = layout({ id: 'parent' })([]);
    model.ui.addWidget(parentLayout);

    const mockComponent: MockComponent = {
      name: 'ChildComponent',
    };
    const msg: AddCustomLayoutMessage<MockComponent> = {
      type: 'AddCustomLayout',
      id: 'custom-child',
      parentLayoutId: 'parent',
      component: mockComponent,
    };

    // Act
    const result = handleAddCustomLayout(model, msg);

    // Assert
    expect(result).toBe(model);
    // Root only contains parent (child is nested)
    expect(result.ui.widgets).toHaveLength(1);
    // Verify child custom layout was added
    expect(result.ui.hasId('custom-child')).toBe(true);
  });
});

describe('handleAddCustomLayout - error cases', () => {
  test('throws error for duplicate ID', () => {
    // Arrange
    const model = initModel(mockMixer);
    // Add existing custom layout
    const existingLayout = customLayout({
      id: 'duplicate-id',
      component: 'ExistingComponent',
    })([]);
    model.ui.addWidget(existingLayout);

    const msg: AddCustomLayoutMessage<string> = {
      type: 'AddCustomLayout',
      id: 'duplicate-id', // Duplicate ID
      component: 'NewComponent',
    };

    // Act & Assert
    expect(() => handleAddCustomLayout(model, msg)).toThrow(
      'Widget with id "duplicate-id" already exists',
    );

    // Model is unchanged (only existing one)
    expect(model.ui.widgets).toHaveLength(1);
  });

  test('throws error for duplicate ID with existing layout', () => {
    // Arrange
    const model = initModel(mockMixer);
    // Add existing regular layout
    const existingLayout = layout({ id: 'same-id' })([]);
    model.ui.addWidget(existingLayout);

    const msg: AddCustomLayoutMessage<string> = {
      type: 'AddCustomLayout',
      id: 'same-id', // Same ID as existing layout
      component: 'Component',
    };

    // Act & Assert
    expect(() => handleAddCustomLayout(model, msg)).toThrow(
      'Widget with id "same-id" already exists',
    );

    // Model is unchanged
    expect(model.ui.widgets).toHaveLength(1);
  });

  test('throws error for non-existent parent layout ID', () => {
    // Arrange
    const model = initModel(mockMixer);
    const msg: AddCustomLayoutMessage<string> = {
      type: 'AddCustomLayout',
      id: 'new-custom-layout',
      parentLayoutId: 'non-existent-parent',
      component: 'Component',
    };

    // Act & Assert
    expect(() => handleAddCustomLayout(model, msg)).toThrow(
      'Layout with id "non-existent-parent" not found',
    );

    // Model is unchanged
    expect(model.ui.widgets).toHaveLength(0);
  });

  test('throws error when non-layout widget ID is specified as parent', () => {
    // Arrange
    const model = initModel(mockMixer);
    // Add Image widget
    const imageWidget = img({
      id: 'image1',
      src: 'test.png',
    });
    model.ui.addWidget(imageWidget);

    const msg: AddCustomLayoutMessage<string> = {
      type: 'AddCustomLayout',
      id: 'new-custom-layout',
      parentLayoutId: 'image1', // Specify Image widget as parent
      component: 'Component',
    };

    // Act & Assert
    // Image doesn't have children property so it can't be treated as Layout
    expect(() => handleAddCustomLayout(model, msg)).toThrow(
      'Layout with id "image1" not found',
    );

    // Model is unchanged (Image only)
    expect(model.ui.widgets).toHaveLength(1);
    expect(model.ui.hasId('image1')).toBe(true);
  });
});
