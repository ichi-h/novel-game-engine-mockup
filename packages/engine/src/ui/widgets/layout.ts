import type { NovelWidget, NovelWidgetBase } from './core';

export interface LayoutWidget<Component = unknown> extends NovelWidgetBase {
  id: string;
  type: 'Layout';
  style?: string;
  children: NovelWidget<Component>[];
}

type LayoutProps<Component> = Omit<
  LayoutWidget<Component>,
  'type' | 'children'
>;

export const layout =
  <Component>(props: LayoutProps<Component>) =>
  (children: NovelWidget<Component>[]): LayoutWidget<Component> => ({
    ...props,
    type: 'Layout',
    children,
  });

export const isLayout = <Component>(
  obj: NovelWidgetBase,
): obj is LayoutWidget<Component> => obj.type === 'Layout';
