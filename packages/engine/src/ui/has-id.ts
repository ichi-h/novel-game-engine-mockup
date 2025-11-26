import {
  isCustomLayout,
  isLayout,
  isTextBox,
  type NovelWidget,
} from './widgets';

/**
 * Check if a widget with the specified ID exists in the widgets array
 */
export const hasId = <Component>(
  widgets: NovelWidget<Component>[],
  id: string,
): boolean => {
  return widgets.some((widget) => {
    if (widget.id === id) {
      return true;
    }

    // Check children for Layout, CustomLayout and TextBox widgets
    if (
      (isLayout(widget) ||
        isCustomLayout<Component>(widget) ||
        isTextBox(widget)) &&
      hasId(widget.children, id)
    ) {
      return true;
    }

    return false;
  });
};
