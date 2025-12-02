import { findById } from './find-by-id';
import { isLayout, isTextBox, type NovelWidget } from './widgets';

/**
 * Clear all TextWidgets in the specified TextBox
 * @returns Updated widgets array
 */
const clearTextBoxInWidgets = (
  textBoxId: string,
  widgets: NovelWidget[],
): NovelWidget[] => {
  return widgets.map((w) => {
    // Found the target textbox
    if (w.id === textBoxId && isTextBox(w)) {
      return {
        ...w,
        children: [],
      };
    }

    // Search in children for Layout widgets
    if (isLayout(w)) {
      const children = clearTextBoxInWidgets(textBoxId, w.children);
      return {
        ...w,
        children,
      };
    }

    return w;
  });
};

/**
 * Clears all TextWidgets in the specified TextBox
 * @param widgets - The array of widgets
 * @param textBoxId - The ID of the TextBox to clear
 * @throws Error if textBoxId doesn't exist
 */
export const clearTextBox = (
  widgets: NovelWidget[],
  textBoxId: string,
): NovelWidget[] => {
  const widget = findById(widgets, textBoxId);
  if (widget === null || isTextBox(widget) === false) {
    throw new Error(`TextBox with id "${textBoxId}" not found`);
  }

  return clearTextBoxInWidgets(textBoxId, widgets);
};
