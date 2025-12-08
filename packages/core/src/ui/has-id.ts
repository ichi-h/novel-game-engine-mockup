import { isLayout, isTextBox, type NovelWidget } from './widgets';

/**
 * Check if a widget with the specified ID exists in the widgets array
 */
export const hasId = (widgets: NovelWidget[], id: string): boolean => {
  return widgets.some((widget) => {
    if (widget.id === id) {
      return true;
    }

    // Check children for Layout and TextBox widgets
    if ((isLayout(widget) || isTextBox(widget)) && hasId(widget.children, id)) {
      return true;
    }

    return false;
  });
};
