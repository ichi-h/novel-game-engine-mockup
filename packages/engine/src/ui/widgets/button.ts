import { murmurhash3, type Optional } from '@/utils';
import type { NovelWidgetBase } from './core';

export interface ButtonWidget extends NovelWidgetBase {
  type: 'Button';
  style?: string;
  label: string;
  // Using unknown to avoid circular dependency with NovelMessage
  // The actual type safety is ensured at the message handler level
  onClick: unknown;
}

type ButtonProps = Optional<Omit<ButtonWidget, 'type'>, 'id'>;

export const button = (props: ButtonProps): ButtonWidget => {
  const { id, ...rests } = props;
  const result = {
    ...rests,
    type: 'Button' as const,
    id: '',
  };
  result.id = id ?? murmurhash3(result);
  return result;
};
