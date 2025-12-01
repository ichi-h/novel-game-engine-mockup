import { murmurhash3, type Optional } from '@/utils';
import type { NovelWidgetBase } from './core';

export interface TextWidget extends NovelWidgetBase {
  type: 'Text';
  style?: string;
  content: string;
  speed?: number;
}

type TextProps = Optional<Omit<TextWidget, 'type'>, 'id'>;

export const text = (props: TextProps): TextWidget => {
  const { id, ...rests } = props;
  const result = {
    ...rests,
    type: 'Text' as const,
    id: '',
  };
  result.id = id ?? murmurhash3(result);
  return result;
};
