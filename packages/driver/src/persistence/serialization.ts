import type { NovelModel } from 'engine';

/**
 * Serialized error representation for IndexedDB storage
 */
export interface SerializedError {
  name: string;
  message: string;
  stack?: string;
}

/**
 * Recursively replace Error objects with SerializedError in a type
 */
type SerializeErrors<T> = T extends Error
  ? SerializedError
  : T extends object
    ? { [K in keyof T]: SerializeErrors<T[K]> }
    : T;

/**
 * Serialized model type where Error objects are recursively converted to plain objects
 */
export type SerializedNovelModel = SerializeErrors<NovelModel>;

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
 * Recursively serialize Error objects in a value
 */
const serializeValue = (value: unknown): unknown => {
  if (value instanceof Error) {
    return serializeError(value);
  }
  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = serializeValue(val);
    }
    return result;
  }
  return value;
};

/**
 * Recursively deserialize Error objects in a value
 */
const deserializeValue = (value: unknown): unknown => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    'message' in value &&
    typeof value.name === 'string' &&
    typeof value.message === 'string' &&
    (!('stack' in value) ||
      value.stack === undefined ||
      typeof value.stack === 'string')
  ) {
    // Heuristic: if it looks like SerializedError, deserialize it
    return deserializeError(value as SerializedError);
  }
  if (Array.isArray(value)) {
    return value.map(deserializeValue);
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = deserializeValue(val);
    }
    return result;
  }
  return value;
};

/**
 * Serialize NovelModel for IndexedDB storage
 */
export const serializeModel = (model: NovelModel): SerializedNovelModel => {
  return serializeValue(model) as SerializedNovelModel;
};

/**
 * Deserialize NovelModel from IndexedDB storage
 */
export const deserializeModel = (
  serialized: SerializedNovelModel,
): NovelModel => {
  return deserializeValue(serialized) as NovelModel;
};
