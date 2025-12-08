import { hasId } from './has-id';
import { isLayout, isTextBox, type NovelWidget } from './widgets';

/**
 * Removes a widget by ID from the specified array of widgets
 * @param id - The ID of the widget to remove
 * @param widgets - The array of widgets to remove from
 * @returns Updated widgets array
 */
const removeByIdFromWidgets = (
  id: string,
  widgets: NovelWidget[],
): NovelWidget[] => {
  return widgets
    .filter((w) => w.id !== id)
    .map((w) => {
      if (isLayout(w)) {
        return {
          ...w,
          children: removeByIdFromWidgets(id, w.children),
        };
      }

      if (isTextBox(w)) {
        return {
          ...w,
          children: w.children.filter((text) => text.id !== id),
        };
      }

      return w;
    });
};

/**
 * Removes a widget by ID
 * @param widgets - The array of widgets
 * @param id - The ID of the widget to remove
 * @throws Error if the widget with the specified ID does not exist
 */
export const removeById = (
  widgets: NovelWidget[],
  id: string,
): NovelWidget[] => {
  if (hasId(widgets, id) === false) {
    throw new Error(`Widget with id "${id}" not found`);
  }

  return removeByIdFromWidgets(id, widgets);
};
