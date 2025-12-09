import { elmish, type Init, type State, type View } from '@ichi-h/elmish';
import type { ApplyMixer } from './mixer';
import type { NovelModel } from './model';
import type { Middleware, NovelMessage } from './update';
import { update } from './update/update';

const listeners = new Set<() => void>();

const createInternalStore = <CustomState = unknown>(): State<
  NovelModel<CustomState>
> => {
  let model: NovelModel<CustomState> | undefined;
  return {
    get: () => model,
    put: (value) => {
      model = value;
      listeners.forEach((listener) => {
        listener();
      });
    },
  };
};

export const tsuzuri = <CustomState = unknown>(
  init: Init<NovelModel<CustomState>, NovelMessage<CustomState>>,
  applyMixer: ApplyMixer,
  middlewares?: Middleware<CustomState>[],
) => {
  const store = createInternalStore<CustomState>();
  const useElement = elmish<NovelModel<CustomState>, NovelMessage<CustomState>>(
    store,
  );

  const returnModel = typeof init === 'function' ? init() : init;
  const [model] = Array.isArray(returnModel) ? returnModel : [returnModel];

  const getModel = () => store.get() ?? model;

  const createSender = (view: View<NovelModel<CustomState>>) => {
    return useElement(init, update(applyMixer, [...(middlewares ?? [])]), view);
  };

  const addListener = (listener: () => void) => {
    listeners.add(listener);
  };

  const deleteListener = (listener: () => void) => {
    listeners.delete(listener);
  };

  return {
    getModel,
    createSender,
    addListener,
    deleteListener,
  };
};
