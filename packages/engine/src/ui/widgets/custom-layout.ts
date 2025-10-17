import type { NovelWidget } from './core';

export interface CustomLayoutWidget<Component> extends NovelWidget {
  id: string;
  type: 'CustomLayout';
  component: Component;
  children: NovelWidget[];
}

type CustomLayoutProps<Component> = Omit<
  CustomLayoutWidget<Component>,
  'type' | 'children'
>;

export const customLayout =
  <Component>(props: CustomLayoutProps<Component>) =>
  (children: NovelWidget[]): CustomLayoutWidget<Component> => ({
    ...props,
    type: 'CustomLayout',
    children,
  });

export const isCustomLayout = <Component>(
  obj: NovelWidget,
): obj is CustomLayoutWidget<Component> => obj.type === 'CustomLayout';
