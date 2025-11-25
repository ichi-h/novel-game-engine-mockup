import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import type { NovelWidget } from '@/ui';

export interface AddWidgetsMessage<Component> extends BaseMessage {
  type: 'AddWidgets';
  widgets: NovelWidget<Component>[];
  layoutId?: string;
}

export const addWidgets = <Component>(
  widgets: NovelWidget<Component>[],
  layoutId?: string,
): AddWidgetsMessage<Component> => {
  return {
    type: 'AddWidgets',
    widgets,
    ...(layoutId !== undefined ? { layoutId } : {}),
  };
};

export const handleAddWidgets = <Component>(
  model: NovelModel<Component>,
  msg: AddWidgetsMessage<Component>,
): NovelModel<Component> => {
  for (const widget of msg.widgets) {
    model.ui.addWidget(widget, msg.layoutId);
  }
  return model;
};
