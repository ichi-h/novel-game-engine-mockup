import type { Mixer } from './mixer';
import { WidgetManager } from './ui';

export interface NovelModel<Component> {
  mixer: Mixer;
  ui: WidgetManager<Component>;
  isDelaying: boolean;
  isApplyingMixer: boolean;
  error: Error | null;
}

export const generateInitModel = <Component>(): NovelModel<Component> => ({
  mixer: { channels: [], volume: 1.0 },
  ui: new WidgetManager<Component>(),
  isDelaying: false,
  isApplyingMixer: false,
  error: null,
});
