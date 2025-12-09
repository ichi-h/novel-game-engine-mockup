import type { NovelModel } from '@ichi-h/tsuzuri-core';
import {
  deserializeModel,
  type SerializedNovelModel,
  serializeModel,
} from './serialization';

const DEFAULT_DB_NAME = 'novel-engine-state';
const STORE_NAME = 'models';
const DB_VERSION = 1;

/**
 * Stored model record in IndexedDB
 */
interface StoredModelRecord<CustomState = unknown> {
  key: string;
  model: SerializedNovelModel<CustomState>;
  savedAt: number;
}

/**
 * Interface for model persistence operations
 */
export interface ModelPersistence<CustomState = unknown> {
  /**
   * Save a model to IndexedDB with the specified key
   */
  save(key: string, model: NovelModel<CustomState>): Promise<void>;
  /**
   * Load a model from IndexedDB by key
   * Returns undefined if not found
   */
  load(key: string): Promise<NovelModel<CustomState> | undefined>;

  /**
   * Delete a model from IndexedDB by key
   */
  remove(key: string): Promise<void>;

  /**
   * Check if a model exists in IndexedDB
   */
  exists(key: string): Promise<boolean>;
}

/**
 * Open or create the IndexedDB database
 */
const openDatabase = (dbName: string): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, DB_VERSION);

    request.onerror = () => {
      reject(new Error(`Failed to open database: ${request.error?.message}`));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
};

/**
 * Create a model persistence instance
 */
export const createModelPersistence = <CustomState = unknown>(
  dbName: string = DEFAULT_DB_NAME,
): ModelPersistence<CustomState> => {
  const save = async (
    key: string,
    model: NovelModel<CustomState>,
  ): Promise<void> => {
    const db = await openDatabase(dbName);
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const record: StoredModelRecord = {
          key,
          model: serializeModel(model),
          savedAt: Date.now(),
        };

        const request = store.put(record);

        request.onerror = () => {
          reject(new Error(`Failed to save model: ${request.error?.message}`));
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    } finally {
      db.close();
    }
  };

  const load = async <CustomState = unknown>(
    key: string,
  ): Promise<NovelModel<CustomState> | undefined> => {
    const db = await openDatabase(dbName);
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onerror = () => {
          reject(new Error(`Failed to load model: ${request.error?.message}`));
        };

        request.onsuccess = () => {
          const record = request.result as
            | StoredModelRecord<CustomState>
            | undefined;
          if (record) {
            resolve(deserializeModel(record.model));
          } else {
            resolve(undefined);
          }
        };
      });
    } finally {
      db.close();
    }
  };

  const remove = async (key: string): Promise<void> => {
    const db = await openDatabase(dbName);
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onerror = () => {
          reject(
            new Error(`Failed to remove model: ${request.error?.message}`),
          );
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    } finally {
      db.close();
    }
  };

  const exists = async (key: string): Promise<boolean> => {
    const db = await openDatabase(dbName);
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.count(key);

        request.onerror = () => {
          reject(
            new Error(
              `Failed to check model existence: ${request.error?.message}`,
            ),
          );
        };

        request.onsuccess = () => {
          resolve(request.result > 0);
        };
      });
    } finally {
      db.close();
    }
  };

  return {
    save,
    load,
    remove,
    exists,
  };
};
