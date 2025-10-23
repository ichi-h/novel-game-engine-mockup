import type { NovelWidgetBase } from './core';

export interface ImageWidget extends NovelWidgetBase {
  type: 'Image';
  style?: string;
  src: string;
}

type ImageProps = Omit<ImageWidget, 'type'>;

export const img = (props: ImageProps): ImageWidget => ({
  ...props,
  type: 'Image',
});
