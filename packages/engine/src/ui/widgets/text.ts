import type { NovelWidgetBase } from './core';

export interface TextWidget extends NovelWidgetBase {
  type: 'Text';
  style?: string;
  content: string;
  speed?: number;
}

type TextProps = Omit<TextWidget, 'type'>;

export const text = (props: TextProps): TextWidget => ({
  ...props,
  type: 'Text',
});
