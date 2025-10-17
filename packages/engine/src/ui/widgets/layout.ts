import type { NovelWidget } from './core';

export interface LayoutWidget extends NovelWidget {
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

export const isLayout = (obj: NovelWidget): obj is LayoutWidget =>
  obj.type === 'Layout';
