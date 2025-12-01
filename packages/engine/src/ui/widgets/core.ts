import type { CustomLayoutWidget } from './custom-layout';
import type { ImageWidget } from './image';
import type { LayoutWidget } from './layout';
import type { TextWidget } from './text';
import type { TextBoxWidget } from './text-box';

export interface NovelWidgetBase {
  id: string;
  type: string;
}

export type NovelWidget<Component = unknown> =
  | LayoutWidget<Component>
  | CustomLayoutWidget<Component>
  | ImageWidget
  | TextBoxWidget
  | TextWidget;
