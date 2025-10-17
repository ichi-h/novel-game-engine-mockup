import type { NovelWidget } from './core';
import type { TextWidget } from './text';

export interface TextBoxWidget extends NovelWidget {
  id: string;
  type: 'TextBox';
  style?: string;
  children: TextWidget[];
}

type TextBoxProps = Omit<TextBoxWidget, 'type' | 'children'>;

export const textBox =
  (props: TextBoxProps) =>
  (children: TextWidget[]): TextBoxWidget => ({
    ...props,
    type: 'TextBox',
    children,
  });

export const isTextBox = (obj: NovelWidget): obj is TextBoxWidget =>
  obj.type === 'TextBox';
