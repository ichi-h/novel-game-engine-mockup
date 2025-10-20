import type { IMixer } from './mixer';
import { WidgetManager } from './ui';

export interface NovelModel {
  mixer: IMixer;
  ui: WidgetManager;
  isDelaying: boolean;
}

export const initModel = (mixer: IMixer): NovelModel => ({
  mixer,
  ui: new WidgetManager(),
  isDelaying: false,
});
