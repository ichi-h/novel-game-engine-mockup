import type { NovelWidget, NovelWidgetBase } from './core';

export interface LayoutWidget extends NovelWidgetBase {
  id: string;
  type: 'Layout';
  style?: string;
  children: NovelWidget[];
}

type LayoutProps = Omit<LayoutWidget, 'type' | 'children'>;

export const layout =
  (props: LayoutProps) =>
  (children: NovelWidget[]): LayoutWidget => ({
    ...props,
    type: 'Layout',
    children,
  });

export const isLayout = (obj: NovelWidgetBase): obj is LayoutWidget =>
  obj.type === 'Layout';
