import type { NovelModel } from '@ichi-h/tsuzuri-core';

/**
 * Page types for routing
 */
export type PageType = 'audio-confirm' | 'title' | 'game' | 'save' | 'load';

/**
 * Router state - discriminated union for type-safe page state
 */
export type RouterState =
  | { page: 'audio-confirm' }
  | { page: 'title' }
  | { page: 'game'; initialModel: NovelModel }
  | { page: 'save'; gameModel: NovelModel }
  | { page: 'load' };

/**
 * Save slot information
 */
export interface SaveSlotInfo {
  slotId: number;
  isEmpty: boolean;
  savedAt?: number;
}
