import type { IMixer } from './mixer';
import { NovelUI } from './objects';

export interface NovelModel {
  mixer: IMixer;
  ui: NovelUI;
}

export const initModel = (mixer: IMixer): NovelModel => ({
  mixer,
  ui: new NovelUI(),
});
