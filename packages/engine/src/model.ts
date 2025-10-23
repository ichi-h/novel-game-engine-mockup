import type { IMixer } from './mixer';
import { WidgetManager } from './ui';

export interface NovelModel<Component> {
  mixer: IMixer;
  ui: WidgetManager<Component>;
  isDelaying: boolean;
  isFetching: boolean;
  error: Error | null;
}

export const generateInitModel = <Component>(
  mixer: IMixer,
): NovelModel<Component> => ({
  mixer,
  ui: new WidgetManager<Component>(),
  isDelaying: false,
  isFetching: false,
  error: null,
});
