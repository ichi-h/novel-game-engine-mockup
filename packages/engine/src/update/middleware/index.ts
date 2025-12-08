export * from './history';
export * from './message-interceptor';
export * from './types';

import { historyMiddleware } from './history';
import { messageInterceptorMiddleware } from './message-interceptor';

export const builtInMiddlewares = [
  historyMiddleware,
  messageInterceptorMiddleware,
];
