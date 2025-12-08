import type { NovelWidgetBase } from './core';
import type { TextWidget } from './text';

export interface TextBoxWidget extends NovelWidgetBase {
  id: string;
  type: 'TextBox';
  className?: string;
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

export const isTextBox = (obj: NovelWidgetBase): obj is TextBoxWidget =>
  obj.type === 'TextBox';
