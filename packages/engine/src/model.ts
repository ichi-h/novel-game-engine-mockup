import type { Mixer } from './mixer-v2';
import { WidgetManager } from './ui';

export interface NovelModel<Component> {
  mixer: Mixer;
  ui: WidgetManager<Component>;
  isDelaying: boolean;
  isApplyingMixer: boolean;
  error: Error | null;
}

export const generateInitModel = <Component>(
  mixer: Mixer,
): NovelModel<Component> => ({
  mixer,
  ui: new WidgetManager<Component>(),
  isDelaying: false,
  isApplyingMixer: false,
  error: null,
});
