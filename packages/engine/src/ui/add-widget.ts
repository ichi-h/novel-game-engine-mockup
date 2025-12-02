import { findById } from './find-by-id';
import { hasId } from './has-id';
import { isLayout, type NovelWidget } from './widgets';

/**
 * Add widgets to layouts with the specified ID.
 * @returns Updated widgets array
 */
const addToLayout = <Component>(
  widget: NovelWidget<Component>,
  layoutId: string,
  widgets: NovelWidget<Component>[],
): NovelWidget<Component>[] => {
  return widgets.map((w) => {
    if (isLayout(w)) {
      // Found the target layout
      if (w.id === layoutId) {
        return {
          ...w,
          children: [...w.children, widget],
        };
      }

      // Search in children for Layout widgets
      const children = addToLayout(widget, layoutId, w.children);
      return {
        ...w,
        children,
      };
    }

    return w;
  });
};

/**
 * Adds a new NovelWidget
 * @param widgets - The array of widgets
 * @param widget - The NovelWidget to add
 * @param layoutId - Optional layout ID where the widget should be added. If not specified, adds to root
 * @throws Error if layoutId doesn't exist
 * @throws Error if widget.id already exists (checks recursively)
 */
export const addWidget = <Component>(
  widgets: NovelWidget<Component>[],
  widget: NovelWidget<Component>,
  layoutId?: string,
): NovelWidget<Component>[] => {
  if (widget.id !== undefined && hasId(widgets, widget.id)) {
    throw new Error(`Widget with id "${widget.id}" already exists`);
  }

  // If no layoutId is specified, add to root
  if (layoutId === undefined) {
    return [...widgets, widget];
  }

  const layoutWidget = findById<Component>(widgets, layoutId);
  if (
    layoutWidget === null ||
    (isLayout(layoutWidget) === false && isLayout(layoutWidget) === false)
  ) {
    throw new Error(`Layout with id "${layoutId}" not found`);
  }

  return addToLayout(widget, layoutId, widgets);
};
