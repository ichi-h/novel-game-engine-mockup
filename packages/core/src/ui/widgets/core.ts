import type { ButtonWidget } from './button';
import type { ImageWidget } from './image';
import type { LayoutWidget } from './layout';
import type { TextWidget } from './text';
import type { TextBoxWidget } from './text-box';

export interface NovelWidgetBase {
  id: string;
  type: string;
  className?: string;
}

export type NovelWidget =
  | LayoutWidget
  | ImageWidget
  | TextBoxWidget
  | TextWidget
  | ButtonWidget;
