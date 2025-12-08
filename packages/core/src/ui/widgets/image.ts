import { murmurhash3, type Optional } from '@/utils';
import type { NovelWidgetBase } from './core';

export interface ImageWidget extends NovelWidgetBase {
  type: 'Image';
  className?: string;
  src: string;
}

type ImageProps = Optional<Omit<ImageWidget, 'type'>, 'id'>;

export const img = (props: ImageProps): ImageWidget => {
  const { id, ...rests } = props;
  const result = {
    ...rests,
    type: 'Image' as const,
    id: '',
  };
  result.id = id ?? murmurhash3(result);
  return result;
};
