import type { NovelWidget } from './core';

export interface TextWidget extends NovelWidget {
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
