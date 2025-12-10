import type { BaseMessage } from '@ichi-h/elmish';
import type { NovelModel } from '@/model';
import { hasId } from '@/ui';
import {
  type ButtonWidget,
  type ImageWidget,
  isLayout,
  isTextBox,
  type LayoutWidget,
  type NovelWidget,
  type TextBoxWidget,
  type TextWidget,
} from '@/ui/widgets';

/**
 * Updatable properties for each widget type (excluding 'type' and 'id')
 */
type UpdatableImageProps = Partial<Omit<ImageWidget, 'type' | 'id'>>;
type UpdatableTextProps = Partial<Omit<TextWidget, 'type' | 'id'>>;
type UpdatableButtonProps = Partial<Omit<ButtonWidget, 'type' | 'id'>>;
type UpdatableLayoutProps = Partial<
  Omit<LayoutWidget, 'type' | 'id' | 'children'>
>;
type UpdatableTextBoxProps = Partial<
  Omit<TextBoxWidget, 'type' | 'id' | 'children'>
>;

/**
 * Discriminated union of update messages for each widget type
 */
type UpdateImageWidgetMessage = {
  widgetType: 'Image';
  props: UpdatableImageProps;
};

type UpdateTextWidgetMessage = {
  widgetType: 'Text';
  props: UpdatableTextProps;
};

type UpdateButtonWidgetMessage = {
  widgetType: 'Button';
  props: UpdatableButtonProps;
};

type UpdateLayoutWidgetMessage = {
  widgetType: 'Layout';
  props: UpdatableLayoutProps;
};

type UpdateTextBoxWidgetMessage = {
  widgetType: 'TextBox';
  props: UpdatableTextBoxProps;
};

type WidgetUpdateSpec =
  | UpdateImageWidgetMessage
  | UpdateTextWidgetMessage
  | UpdateButtonWidgetMessage
  | UpdateLayoutWidgetMessage
  | UpdateTextBoxWidgetMessage;

export interface UpdateWidgetPropsMessage extends BaseMessage {
  type: 'UpdateWidgetProps';
  widgetId: string;
  spec: WidgetUpdateSpec;
}

/**
 * Creates a message to update widget properties
 *
 * This function allows partial updates of widget properties while preserving type safety.
 * Only properties that are explicitly provided will be updated; other properties remain unchanged.
 *
 * Note: 'type' and 'id' properties cannot be updated. For Layout and TextBox widgets,
 * 'children' property cannot be updated (use add/remove operations instead).
 *
 * @example
 * // Update image source
 * updateWidgetProps('character-img', {
 *   widgetType: 'Image',
 *   props: { src: CHARACTER_IMAGES.zundamon.smile }
 * })
 *
 * @example
 * // Update multiple properties at once
 * updateWidgetProps('my-img', {
 *   widgetType: 'Image',
 *   props: { src: 'new.png', className: 'fade-in' }
 * })
 *
 * @example
 * // Update text content
 * updateWidgetProps('text-1', {
 *   widgetType: 'Text',
 *   props: { content: 'New text', speed: 100 }
 * })
 *
 * @param widgetId - The ID of the widget to update
 * @param spec - Widget type and properties to update
 * @returns UpdateWidgetPropsMessage
 */
export const updateWidgetProps = <T extends WidgetUpdateSpec>(
  widgetId: string,
  spec: T,
): UpdateWidgetPropsMessage => {
  return {
    type: 'UpdateWidgetProps',
    widgetId,
    spec,
  };
};

/**
 * Updates the properties of a widget with the specified ID
 * @param widgetId - The ID of the widget to update
 * @param widgetType - The type of widget being updated
 * @param props - The properties to update
 * @param widgets - The array of widgets to search in
 * @returns Updated widgets array
 */
const updateWidgetPropsInTree = (
  widgetId: string,
  widgetType: string,
  props: Record<string, unknown>,
  widgets: NovelWidget[],
): NovelWidget[] => {
  return widgets.map((widget) => {
    if (widget.id === widgetId && widget.type === widgetType) {
      return {
        ...widget,
        ...props,
      };
    }

    if (isLayout(widget)) {
      return {
        ...widget,
        children: updateWidgetPropsInTree(
          widgetId,
          widgetType,
          props,
          widget.children,
        ),
      };
    }

    if (isTextBox(widget)) {
      return {
        ...widget,
        children: widget.children.map((text: TextWidget) =>
          text.id === widgetId && text.type === widgetType
            ? { ...text, ...props }
            : text,
        ),
      };
    }

    return widget;
  });
};

export const handleUpdateWidgetProps = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: UpdateWidgetPropsMessage,
): NovelModel<CustomState> => {
  if (hasId(model.ui, msg.widgetId) === false) {
    throw new Error(`Widget with id "${msg.widgetId}" not found`);
  }

  return {
    ...model,
    ui: updateWidgetPropsInTree(
      msg.widgetId,
      msg.spec.widgetType,
      msg.spec.props,
      model.ui,
    ),
  };
};
