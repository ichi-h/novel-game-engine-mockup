import type { NovelMessage, NovelModel } from 'engine';

/**
 * Serialized error representation for IndexedDB storage
 */
export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
}

/**
 * Serialized model type where Error objects are converted to plain objects
 */
export type SerializedNovelModel = Omit<NovelModel, 'status'> & {
  status:
    | { value: 'Processed' }
    | { value: 'Intercepted'; message: NovelMessage }
    | { value: 'Error'; error: SerializedError };
};

/**
 * Serialize an Error object to a plain object
 */
const serializeError = (error: Error): SerializedError => {
  const serialized: SerializedError = {
    name: error.name,
    message: error.message,
  };
  if (error.stack !== undefined) {
    serialized.stack = error.stack;
  }
  return serialized;
};

/**
 * Deserialize a plain object back to an Error instance
 */
const deserializeError = (serialized: SerializedError): Error => {
  const error = new Error(serialized.message);
  error.name = serialized.name;
  if (serialized.stack) {
    error.stack = serialized.stack;
  }
  return error;
};

/**
 * Serialize NovelModel for IndexedDB storage
 */
export const serializeModel = (model: NovelModel): SerializedNovelModel => {
  if (model.status.value === 'Error') {
    return {
      ...model,
      status: {
        value: 'Error',
        error: serializeError(model.status.error),
      },
    };
  }
  return model;
};

/**
 * Deserialize NovelModel from IndexedDB storage
 */
export const deserializeModel = (
  serialized: SerializedNovelModel,
): NovelModel => {
  if (serialized.status.value === 'Error') {
    return {
      ...serialized,
      status: {
        value: 'Error',
        error: deserializeError(serialized.status.error),
      },
    };
  }
  return serialized;
};
