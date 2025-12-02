import { findById } from './find-by-id';
import { hasId } from './has-id';
import {
  isLayout,
  isTextBox,
  type NovelWidget,
  type TextWidget,
} from './widgets';

/**
 * Add TextWidget to TextBoxWidget with the specified ID.
 * @returns Updated widgets array, or null if textbox not found
 */
const addToTextBox = <Component>(
  textWidget: TextWidget,
  textBoxId: string,
  widgets: NovelWidget<Component>[],
): NovelWidget<Component>[] => {
  return widgets.map((w) => {
    // Found the target textbox
    if (w.id === textBoxId && isTextBox(w)) {
      return {
        ...w,
        children: [...w.children, textWidget],
      };
    }

    // Search in children for Layout widgets
    if (isLayout(w)) {
      const children = addToTextBox(textWidget, textBoxId, w.children);
      if (children !== null) {
        return {
          ...w,
          children,
        };
      }
    }

    return w;
  });
};

/**
 * Adds a new TextWidget to a TextBoxWidget
 * @param widgets - The array of widgets
 * @param textWidget - The TextWidget to add
 * @param textBoxId - The TextBox ID where the text should be added
 * @throws Error if textBoxId doesn't exist
 * @throws Error if textWidget.id already exists
 */
export const addText = <Component>(
  widgets: NovelWidget<Component>[],
  textWidget: TextWidget,
  textBoxId: string,
): NovelWidget<Component>[] => {
  if (textWidget.id !== undefined && hasId(widgets, textWidget.id)) {
    throw new Error(`Widget with id "${textWidget.id}" already exists`);
  }

  const widget = findById<Component>(widgets, textBoxId);
  if (widget === null || isTextBox(widget) === false) {
    throw new Error(`TextBox with id "${textBoxId}" not found`);
  }

  return addToTextBox(textWidget, textBoxId, widgets);
};
