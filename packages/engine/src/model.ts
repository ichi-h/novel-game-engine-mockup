import type { IMixer } from './mixer';
import type { NovelObject } from './objects';

export interface NovelModel {
  mixer: IMixer;
  ui: NovelObject[];
}

export const initModel = (mixer: IMixer): NovelModel => ({
  mixer,
  ui: [],
});
