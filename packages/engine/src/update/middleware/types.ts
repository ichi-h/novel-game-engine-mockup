import type { ReturnModel } from 'elmish';
import type { NovelModel } from '@/model';
import type { NovelMessage } from '../message';

export type MiddlewareNext<CustomState = unknown> = (
  model: NovelModel<CustomState>,
  msg: NovelMessage<CustomState>,
) => ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>>;

export type Middleware<CustomState = unknown> = (
  model: NovelModel<CustomState>,
  msg: NovelMessage<CustomState>,
  next: MiddlewareNext<CustomState>,
) => ReturnModel<NovelModel<CustomState>, NovelMessage<CustomState>>;
