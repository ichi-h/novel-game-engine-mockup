export * from './history';
export * from './message-interceptor';

import { historyMiddleware } from './history';
import { messageInterceptorMiddleware } from './message-interceptor';

export const builtInMiddlewares = [
  historyMiddleware,
  messageInterceptorMiddleware,
];
