import { isLayout, isTextBox, type NovelWidget } from './widgets';

/**
 * Recursively find a widget by ID
 * @returns The found widget or null if not found
 */
export const findById = <Component>(
  widgets: NovelWidget<Component>[],
  id: string,
): NovelWidget<Component> | null => {
  for (const widget of widgets) {
    if (widget.id === id) {
      return widget;
    }

    // Search in children for Layout and TextBox widgets
    if (isLayout(widget) || isTextBox(widget)) {
      const foundInChildren = findById(widget.children, id);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }

  return null;
};
