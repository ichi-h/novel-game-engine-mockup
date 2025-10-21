import type { IMixer } from './mixer';
import { WidgetManager } from './ui';

export interface NovelModel {
  mixer: IMixer;
  ui: WidgetManager;
  isDelaying: boolean;
  isFetching: boolean;
  error: Error | null;
}

export const generateInitModel = (mixer: IMixer): NovelModel => ({
  mixer,
  ui: new WidgetManager(),
  isDelaying: false,
  isFetching: false,
  error: null,
});
