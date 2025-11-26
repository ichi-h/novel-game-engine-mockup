import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { addWidget, customLayout, hasId, img, layout } from '@/ui';
import {
  type AddCustomLayoutMessage,
  addCustomLayout,
  handleAddCustomLayout,
} from '../add-custom-layout';

// Mock component type for testing
interface MockComponent {
  name: string;
  props?: Record<string, unknown>;
}

describe('addCustomLayout', () => {
  describe('normal cases', () => {
    test('creates message with only required fields', () => {
      // Arrange & Act
      const result = addCustomLayout('custom1', 'TestComponent');

      // Assert
      expect(result).toEqual({
        type: 'AddCustomLayout',
        id: 'custom1',
        component: 'TestComponent',
      });
    });

    test('creates message with all optional fields', () => {
      // Arrange & Act
      const result = addCustomLayout('custom1', 'TestComponent', 'parent');

      // Assert
      expect(result).toEqual({
        type: 'AddCustomLayout',
        id: 'custom1',
        component: 'TestComponent',
        parentLayoutId: 'parent',
      });
    });
  });
});

describe('handleAddCustomLayout - normal cases', () => {
  test('adds custom layout to root', () => {
    // Arrange
    const model = generateInitModel();
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
    expect(result.ui).toHaveLength(1);
    expect(hasId(result.ui, 'custom-layout-1')).toBe(true);
  });

  test('adds custom layout to parent layout', () => {
    // Arrange
    const model = generateInitModel();
    // First, add parent layout
    model.ui = addWidget(model.ui, layout({ id: 'parent' })([]));

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
    // Root only contains parent (child is nested)
    expect(result.ui).toHaveLength(1);
    // Verify child custom layout was added
    expect(hasId(result.ui, 'custom-child')).toBe(true);
  });
});

describe('handleAddCustomLayout - error cases', () => {
  test('throws error for duplicate ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add existing custom layout
    model.ui = addWidget(
      model.ui,
      customLayout({
        id: 'duplicate-id',
        component: 'ExistingComponent',
      })([]),
    );

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
    expect(model.ui).toHaveLength(1);
  });

  test('throws error for duplicate ID with existing layout', () => {
    // Arrange
    const model = generateInitModel();
    // Add existing regular layout
    model.ui = addWidget(model.ui, layout({ id: 'same-id' })([]));

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
    expect(model.ui).toHaveLength(1);
  });

  test('throws error for non-existent parent layout ID', () => {
    // Arrange
    const model = generateInitModel();
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
    expect(model.ui).toHaveLength(0);
  });

  test('throws error when non-layout widget ID is specified as parent', () => {
    // Arrange
    const model = generateInitModel();
    // Add Image widget
    model.ui = addWidget(model.ui, img({ id: 'image1', src: 'test.png' }));

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
    expect(model.ui).toHaveLength(1);
    expect(hasId(model.ui, 'image1')).toBe(true);
  });
});
