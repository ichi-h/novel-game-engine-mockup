import type { BaseMessage } from 'elmish';
import type { NovelModel } from '@/model';
import { addWidget, type w } from '@/ui';

export interface AddWidgetsMessage extends BaseMessage {
  type: 'AddWidgets';
  widgets: w.NovelWidget[];
  layoutId?: string;
}

export const addWidgets = (
  widgets: w.NovelWidget[],
  layoutId?: string,
): AddWidgetsMessage => {
  return {
    type: 'AddWidgets',
    widgets,
    ...(layoutId !== undefined ? { layoutId } : {}),
  };
};

export const handleAddWidgets = <CustomState = unknown>(
  model: NovelModel<CustomState>,
  msg: AddWidgetsMessage,
): NovelModel<CustomState> => {
  return {
    ...model,
    ui: msg.widgets.reduce(
      (ui, widget) => addWidget(ui, widget, msg.layoutId),
      model.ui,
    ),
  };
};
