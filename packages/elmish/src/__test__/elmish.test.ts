import { beforeEach, describe, expect, test } from 'bun:test';

import { elmish } from '../elmish';
import type { Init, Update } from '../types';

type Model = {
  count: number;
};

type Msg =
  | {
      type: 'increment';
    }
  | {
      type: 'decrement';
    }
  | {
      type: 'asyncIncrement';
    }
  | {
      type: 'asyncDecrement';
    };

const update: Update<Model, Msg> = (model, msg) => {
  switch (msg.type) {
    case 'increment':
      return { count: model.count + 1 };
    case 'decrement':
      return { count: model.count - 1 };
    case 'asyncIncrement':
      return [
        model,
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ type: 'increment' });
            }, 10);
          }),
      ];
    case 'asyncDecrement':
      return [
        model,
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ type: 'decrement' });
            }, 10);
          }),
      ];
  }
};

describe('elmish test', () => {
  let model: Model = { count: 0 };

  const updateViewMock = (newModel: Model) => {
    model = newModel;
  };

  beforeEach(() => {
    model = { count: 0 };
  });

  test('send message', () => {
    const useElement = elmish<Model, Msg>();
    const send = useElement(model, update, updateViewMock);
    send({ type: 'increment' });
    expect(model.count).toBe(1);
  });

  test('send async message', async () => {
    const useElement = elmish<Model, Msg>();
    const send = useElement(model, update, updateViewMock);
    for (let i = 0; i < 10; i++) {
      send({ type: 'asyncIncrement' });
      send({ type: 'asyncIncrement' });
      send({ type: 'asyncDecrement' });
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(model.count).toBe(10);
  });

  test('initialize element with function', async () => {
    const init: Init<Model, Msg> = () => [
      model,
      async () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ type: 'increment' });
          }, 1);
        }),
    ];
    const useElement = elmish<Model, Msg>();
    useElement(init, update, updateViewMock);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(model.count).toBe(1);
  });
});
