import type { BaseMessage } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';
import { hasId } from '@/ui';
import {
  isLayout,
  isTextBox,
  type NovelWidget,
  type TextWidget,
} from '@/ui/widgets';

export interface UpdateWidgetStyleMessage extends BaseMessage {
  type: 'UpdateWidgetStyle';
  widgetId: string;
  className: string;
  method?: 'put' | 'add' | 'remove';
}

export const updateWidgetStyle = ({
  widgetId,
  className,
  method,
}: Omit<UpdateWidgetStyleMessage, 'type'>): UpdateWidgetStyleMessage => {
  const message: UpdateWidgetStyleMessage = {
    type: 'UpdateWidgetStyle',
    widgetId,
    className,
  };

  if (method !== undefined) {
    message.method = method;
  }

  return message;
};

/**
 * Updates the className of a widget with the specified ID
 * @param widgetId - The ID of the widget to update
 * @param className - The new className to set
 * @param widgets - The array of widgets to search in
 * @returns Updated widgets array
 */
const updateWidgetClassName = (
  widgetId: string,
  className: string,
  widgets: NovelWidget[],
  method: 'put' | 'add' | 'remove' = 'put',
): NovelWidget[] => {
  const applyClassName = (currentClassName: string | undefined): string => {
    if (method === 'add') {
      return currentClassName ? `${currentClassName} ${className}` : className;
    }
    if (method === 'remove') {
      if (!currentClassName) return '';
      return currentClassName
        .split(' ')
        .filter((cls) => cls !== className)
        .join(' ');
    }
    // method === 'put'
    return className;
  };

  return widgets.map((widget) => {
    if (widget.id === widgetId) {
      return {
        ...widget,
        className: applyClassName(widget.className),
      };
    }

    if (isLayout(widget)) {
      return {
        ...widget,
        children: updateWidgetClassName(
          widgetId,
          className,
          widget.children,
          method,
        ),
      };
    }

    if (isTextBox(widget)) {
      return {
        ...widget,
        children: widget.children.map((text: TextWidget) =>
          text.id === widgetId
            ? { ...text, className: applyClassName(text.className) }
            : text,
        ),
      };
    }

    return widget;
  });
};

export const handleUpdateWidgetStyle = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: UpdateWidgetStyleMessage,
): NovelModel<CustomState> => {
  if (hasId(model.ui, msg.widgetId) === false) {
    throw new Error(`Widget with id "${msg.widgetId}" not found`);
  }

  return {
    ...model,
    ui: updateWidgetClassName(
      msg.widgetId,
      msg.className,
      model.ui,
      msg.method,
    ),
  };
};
