import { describe, expect, test } from 'bun:test';
import { generateInitModel } from '@/model';
import { addWidget, hasId, w } from '@/ui';
import { calcTextAnimationDuration } from '@/update/animation';
import {
  addText,
  handleAddText,
  handleTextAnimationCompleted,
  type ShowAddMessage,
  type TextAnimationCompletedMessage,
} from '../add-text';

describe('addText', () => {
  describe('normal cases', () => {
    test('creates message with only required fields', () => {
      // Arrange & Act
      const result = addText({
        textBoxId: 'textbox1',
        content: 'Hello, World!',
      });

      // Assert
      expect(result).toEqual({
        type: 'AddText',
        textBoxId: 'textbox1',
        content: 'Hello, World!',
      });
    });

    test('creates message with all optional fields', () => {
      // Arrange & Act
      const result = addText({
        textBoxId: 'textbox1',
        content: 'Hello, World!',
        id: 'text1',
        className: 'font-weight: bold;',
        speed: 50,
      });

      // Assert
      expect(result).toEqual({
        type: 'AddText',
        textBoxId: 'textbox1',
        content: 'Hello, World!',
        id: 'text1',
        className: 'font-weight: bold;',
        speed: 50,
      });
    });

    test('creates message with nextMessageCaught parameter', () => {
      // Arrange & Act
      const result = addText({
        textBoxId: 'textbox1',
        content: 'Hello, World!',
        id: 'text1',
        className: 'font-weight: bold;',
        speed: 50,
        nextMessageCaught: 'merge',
      });

      // Assert
      expect(result).toEqual({
        type: 'AddText',
        textBoxId: 'textbox1',
        content: 'Hello, World!',
        id: 'text1',
        className: 'font-weight: bold;',
        speed: 50,
        nextMessageCaught: 'merge',
      });
    });
  });
});

describe('handleAddText - normal cases', () => {
  test('adds text to text box with only required fields', () => {
    // Arrange
    const model = generateInitModel();
    // First, add parent layout and text box
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowAddMessage = {
      type: 'AddText',
      textBoxId: 'textbox1',
      content: 'Hello, World!',
    };

    // Act
    const result = handleAddText(model, msg);

    // Assert
    // Verify text box still exists
    const resultModel = Array.isArray(result) ? result[0] : result;
    expect(hasId(resultModel.ui, 'textbox1')).toBe(true);
  });

  test('adds text to text box with id', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowAddMessage = {
      type: 'AddText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'Hello with ID',
    };

    // Act
    const result = handleAddText(model, msg);

    // Assert
    const resultModel = Array.isArray(result) ? result[0] : result;
    expect(hasId(resultModel.ui, 'text1')).toBe(true);
    expect(hasId(resultModel.ui, 'textbox1')).toBe(true);
  });

  test('adds text to text box with all optional fields', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowAddMessage = {
      type: 'AddText',
      id: 'text-all',
      textBoxId: 'textbox1',
      content: 'Complete text',
      className: 'font-weight: bold;',
      speed: 50,
    };

    // Act
    const result = handleAddText(model, msg);

    // Assert
    const resultModel = Array.isArray(result) ? result[0] : result;
    expect(hasId(resultModel.ui, 'text-all')).toBe(true);
    expect(hasId(resultModel.ui, 'textbox1')).toBe(true);
  });

  test('adds multiple texts to same text box', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg1: ShowAddMessage = {
      type: 'AddText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'First text',
    };

    const msg2: ShowAddMessage = {
      type: 'AddText',
      id: 'text2',
      textBoxId: 'textbox1',
      content: 'Second text',
    };

    // Act
    let result = handleAddText(model, msg1);
    const model1 = Array.isArray(result) ? result[0] : result;
    result = handleAddText(model1, msg2);

    // Assert
    const resultModel = Array.isArray(result) ? result[0] : result;
    expect(hasId(resultModel.ui, 'text1')).toBe(true);
    expect(hasId(resultModel.ui, 'text2')).toBe(true);
    expect(hasId(resultModel.ui, 'textbox1')).toBe(true);
  });

  test('returns only model when speed is 100 or greater (no animation)', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowAddMessage = {
      type: 'AddText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'Fast text',
      speed: 100,
    };

    // Act
    const result = handleAddText(model, msg);

    // Assert
    expect(Array.isArray(result)).toBe(false);
    if (!Array.isArray(result)) {
      expect(hasId(result.ui, 'text1')).toBe(true);
      expect(result.animationTickets).toHaveLength(0);
    }
  });

  test('returns tuple with command when speed is less than 100 (with animation)', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowAddMessage = {
      type: 'AddText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'Animated text',
      speed: 50,
    };

    // Act
    const result = handleAddText(model, msg);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      const [newModel, cmd] = result;
      expect(hasId(newModel.ui, 'text1')).toBe(true);
      expect(newModel.animationTickets).toHaveLength(1);
      expect(newModel.animationTickets[0]?.id).toBe('text1');
      expect(newModel.animationTickets[0]?.nextMessageCaught).toBe('insert');
      expect(cmd).toBeDefined();
    }
  });

  test('uses model.config.textAnimationSpeed when speed is not specified', () => {
    // Arrange
    const model = generateInitModel();
    model.config.textAnimationSpeed = 30;
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowAddMessage = {
      type: 'AddText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'Default speed text',
    };

    // Act
    const result = handleAddText(model, msg);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      const [newModel, _cmd] = result;
      expect(newModel.animationTickets).toHaveLength(1);
      expect(newModel.animationTickets[0]?.ttl).toBe(
        calcTextAnimationDuration(30, msg.content.length),
      );
    }
  });

  test('sets nextMessageCaught to "merge" when specified', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowAddMessage = {
      type: 'AddText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'Complete text',
      speed: 50,
      nextMessageCaught: 'merge',
    };

    // Act
    const result = handleAddText(model, msg);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      const [newModel, _cmd] = result;
      expect(newModel.animationTickets).toHaveLength(1);
      expect(newModel.animationTickets[0]?.nextMessageCaught).toBe('merge');
    }
  });

  test('animation command returns TextAnimationCompletedMessage', async () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    const msg: ShowAddMessage = {
      type: 'AddText',
      id: 'text1',
      textBoxId: 'textbox1',
      content: 'x',
      speed: 99,
    };

    // Act
    const result = handleAddText(model, msg);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      const [_newModel, cmd] = result;
      if (cmd) {
        const mergedMsg = await cmd();
        expect(mergedMsg).toEqual({
          type: 'TextAnimationCompleted',
          id: 'text1',
        });
      }
    }
  });
});

describe('handleAddText - error cases', () => {
  test('throws error for duplicate text ID', () => {
    // Arrange
    const model = generateInitModel();
    model.ui = addWidget(model.ui, w.layout({ id: 'parent' })([]));
    model.ui = addWidget(model.ui, w.textBox({ id: 'textbox1' })([]), 'parent');

    // Add first text
    const msg1: ShowAddMessage = {
      type: 'AddText',
      id: 'duplicate-text',
      textBoxId: 'textbox1',
      content: 'First text',
    };
    const result = handleAddText(model, msg1);
    const newModel = Array.isArray(result) ? result[0] : result;

    // Try to add text with duplicate ID
    const msg2: ShowAddMessage = {
      type: 'AddText',
      id: 'duplicate-text',
      textBoxId: 'textbox1',
      content: 'Second text',
    };

    // Act & Assert
    expect(() => handleAddText(newModel, msg2)).toThrow(
      'Widget with id "duplicate-text" already exists',
    );

    // Model contains only first text
    expect(hasId(newModel.ui, 'duplicate-text')).toBe(true);
  });

  test('throws error for non-existent text box ID', () => {
    // Arrange
    const model = generateInitModel();

    const msg: ShowAddMessage = {
      type: 'AddText',
      textBoxId: 'non-existent-textbox',
      content: 'Hello',
    };

    // Act & Assert
    expect(() => handleAddText(model, msg)).toThrow(
      'TextBox with id "non-existent-textbox" not found',
    );

    // Model is unchanged
    expect(model.ui).toHaveLength(0);
  });

  test('throws error when text ID conflicts with existing widget ID', () => {
    // Arrange
    const model = generateInitModel();
    // Add layout
    model.ui = addWidget(model.ui, w.layout({ id: 'existing-widget' })([]));
    // Add text box
    model.ui = addWidget(
      model.ui,
      w.textBox({ id: 'textbox1' })([]),
      'existing-widget',
    );

    const msg: ShowAddMessage = {
      type: 'AddText',
      id: 'existing-widget', // Conflicts with layout ID
      textBoxId: 'textbox1',
      content: 'Text',
    };

    // Act & Assert
    expect(() => handleAddText(model, msg)).toThrow(
      'Widget with id "existing-widget" already exists',
    );
  });
});

describe('handleTextAnimationCompleted', () => {
  describe('normal cases', () => {
    test('removes animation ticket with matching ID', () => {
      // Arrange
      const model = generateInitModel();
      model.animationTickets = [
        { id: 'text1', ttl: 1000, nextMessageCaught: 'insert' },
      ];

      const msg: TextAnimationCompletedMessage = {
        type: 'TextAnimationCompleted',
        id: 'text1',
      };

      // Act
      const result = handleTextAnimationCompleted(model, msg);

      // Assert
      expect(result.animationTickets).toHaveLength(0);
    });

    test('removes only the specified ticket when multiple tickets exist', () => {
      // Arrange
      const model = generateInitModel();
      model.animationTickets = [
        { id: 'text1', ttl: 1000, nextMessageCaught: 'insert' },
        { id: 'text2', ttl: 2000, nextMessageCaught: 'merge' },
        { id: 'text3', ttl: 3000, nextMessageCaught: 'insert' },
      ];

      const msg: TextAnimationCompletedMessage = {
        type: 'TextAnimationCompleted',
        id: 'text2',
      };

      // Act
      const result = handleTextAnimationCompleted(model, msg);

      // Assert
      expect(result.animationTickets).toHaveLength(2);
      expect(result.animationTickets[0]?.id).toBe('text1');
      expect(result.animationTickets[1]?.id).toBe('text3');
    });

    test('does not modify model when ID does not exist', () => {
      // Arrange
      const model = generateInitModel();
      model.animationTickets = [
        { id: 'text1', ttl: 1000, nextMessageCaught: 'insert' },
      ];

      const msg: TextAnimationCompletedMessage = {
        type: 'TextAnimationCompleted',
        id: 'non-existent',
      };

      // Act
      const result = handleTextAnimationCompleted(model, msg);

      // Assert
      expect(result.animationTickets).toHaveLength(1);
      expect(result.animationTickets[0]?.id).toBe('text1');
    });
  });
});
