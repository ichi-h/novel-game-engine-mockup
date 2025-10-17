import type { NovelWidget } from './core';

export interface ImageWidget extends NovelWidget {
  type: 'Image';
  style?: string;
  src: string;
}

type ImageProps = Omit<ImageWidget, 'type'>;

export const img = (props: ImageProps): ImageWidget => ({
  ...props,
  type: 'Image',
});
