import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, type NovelWidget } from '@/ui';

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
  return {
    ...model,
    ui: msg.widgets.reduce(
      (ui, widget) => addWidget(ui, widget, msg.layoutId),
      model.ui,
    ),
  };
};
