import type { NovelWidget, NovelWidgetBase } from './core';

export interface CustomLayoutWidget<Component = unknown>
  extends NovelWidgetBase {
  id: string;
  type: 'CustomLayout';
  component: Component;
  children: NovelWidget<Component>[];
}

type CustomLayoutProps<Component> = Omit<
  CustomLayoutWidget<Component>,
  'type' | 'children'
>;

export const customLayout =
  <Component>(props: CustomLayoutProps<Component>) =>
  (children: NovelWidget<Component>[]): CustomLayoutWidget<Component> => ({
    ...props,
    type: 'CustomLayout',
    children,
  });

export const isCustomLayout = <Component>(
  obj: NovelWidgetBase,
): obj is CustomLayoutWidget<Component> => obj.type === 'CustomLayout';
